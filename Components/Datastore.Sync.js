

var Datastore 	= require('./Datastore');
var Config  	= require('./Datastore.Config');
var xhr 		= require("xhr");


var _running = false;
var _progress_cb = null;
var _completion_cb = null;
var _step = 0;
var _steps = 0;
var _tables = [];

var _stopped = false;
var _mode = "sync";

var jsonHeaders = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-Auth-Token': Config.auth_token
};

module.exports.Cancel = function(){
	if( _running ){
		_stopped = true;
		_stop();
	}
}

module.exports.Sync = function( progress_cb, completion_cb ){
	if( _running ){
		console.log( "Sync already running" );
		return;
	}

	console.log('= Datastore.Sync Starting');
	_running = true;
	

	_progress_cb = progress_cb;
	_completion_cb = completion_cb;
	
	// sync all except those in Config.uploadOnly
	_tables = Config.tables.filter( function(el){ return Config.uploadOnly.indexOf(el) == -1 });

	_steps  = _tables.length;
	_step   = 0;
	_mode   = "sync";

	_next();
}

function _stop(){
	//TODO: Need a way to cancel ongoing requests
	_progress_cb( _steps, _steps, _tables[_step] );
	_completion_cb("Canceled", true);
	_stopped = false;
	_running = false;
}

function _done(){
	_running = false;
	_completion_cb("Sync done!", null);
}

function _next(){
	
	if( _stopped ){
		_stop();
		return;
	}
	if( !_running ){
		return;
	}

	_progress_cb( (_step+1), _steps, _tables[_step] );
	_step ++;
	if( _step < _steps ){
		if( _mode == "sync" ){
			_check( _tables[_step] );
		}else if( _mode == "upload" ){
			_upload();
		}
	}else{
		//_running = false;
		//_completion_cb("Sync done!", null);
		_done();

		//_start_upload();

		/*
		for(var t in Config.tables){
			console.log("");
			console.log('Local data in '+ Config.tables[t] +":");
			console.log( Datastore.all( Config.tables[t] ) );
		}
		*/
	}
}

function _progress(id, type){
	console.log("_progress:", id, type);
}

function _check(_table, cb){
	if( !Datastore.findTable(_table) ){
		console.log("Datastore.Sync.Check: Unknown table", _table);
		return _next();
	}

	Datastore.all(_table, function(items){

		_progress("% Starting ", _table );

		//console.log('%% local items in table', _table, ":", items);

		var x = xhr({
			'method':'POST', 
			'json':{list: items},
			'uri': Config.server +'/'+ _table +'/diff',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Auth-Token': Config.auth_token
			},
			'timeout': Config.timeout
		}, function (err, resp, body){
				_progress("% Received response for ", _table );
				//console.log("diff err, resp, body:", err, resp, body );

				if( err ){
					_completion_cb("Network error", true);

				}else if( body.status == 'error' ){
					_completion_cb("Error: "+ body.msg, true);
				}else if( body.status == 'ok' ){
					_apply( body.msg );
     			}
			}
		);

		//console.log('############ x', x);

	});
}

function _apply(cmd){
	//console.log("Datastore.Sync.Merge: cmd", cmd);

	/*
	// Sample response:
	{ status: 'ok',
	  msg: 
	   { table: 'countries',
	     add: [ { countryCode: 'RU', name: 'Russia' } ],
	     put: [ { countryCode: 'SE', name: 'Sweden', _id: 2 }, { countryCode: 'FI', name: 'Finland', _id: 4 } ],
	     del: [ { name: 'Denmark', countryCode: 'dk', _id: 1 } ]
	   }
	 }
	*/

	//console.log('####################cmd', cmd);

	var table = cmd.table;
	if( !Datastore.findTable(table) ){
		console.log("Datastore.Sync.Merge: Unknown table", table);
		return _next();
	}

	//_progress("% Processing instructions for ", table, cmd );

	for(c in cmd.add ){
		console.log("Creating", cmd.add[c] );
		Datastore.add(table, cmd.add[c] );
	}
	for( c in cmd.put ){
		console.log("Updating", cmd.put[c]._id, cmd.put[c] );
		Datastore.put(table, cmd.put[c]._id, cmd.put[c]);
	}
	for( c in cmd.del ){
		console.log("Deleting", cmd.del[c]._id, cmd.del[c] );
		Datastore.del(table, cmd.del[c]._id);
	}

	_progress("% Diffing completed for ", table );
	_next();
}

function _start_upload(){
	console.log("Starting upload");

	_tables = Config.uploadOnly;
	_steps  = _tables.length;
	_step   = 0;
	_mode   = "upload";
	_progress_cb( _steps, _steps, _tables[_step] );
}

function _upload(){
	console.log('uploading entries in', Config.uploadOnly );
}

