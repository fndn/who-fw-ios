
// integrates with fndn-mirror on the server

var Datastore 	= require('./Datastore');
var xhr 		= require("xhr");
var shortid 	= require('shortid');
var FileUpload 	= require('NativeModules').FileUpload;


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
	'X-Auth-Token': Datastore.Config.auth_token
};

module.exports.Cancel = function(){
	if( _running ){
		_stopped = true;
		_stop();
	}
}


function _uploadImage(_path, _fields){
	var obj = {
		uploadUrl: Datastore.Config.server +'/images/upload',
		method: 'POST', // default 'POST',support 'POST' and 'PUT'
		headers: {
			'Accept': 'application/json',
		},
		fields: _fields,
		files: [
			{
				filename: 'testupload_'+ Date.now() +'.jpg', // require, file name
				filepath: _path, // require, file absoluete path
				filetype: 'image/jpeg', // options, if none, will get mimetype from `filepath` extension
			},
		]
	};
	FileUpload.upload(obj, function(err, result) {
		console.log('upload:', err, result);
	})
};
module.exports.testUpload = _uploadImage;

//Datastore.Sync.testUpload("assets-library://asset/asset.JPG?id=E9340E11-6E7E-47D0-80D8-1971E31FA655&ext=JPG", {});

module.exports.Sync = function( progress_cb, completion_cb, mode ){
	if( _running ){
		console.log( "Sync already running" );
		return;
	}

	_running 		= true;
	_mode   		= mode || "sync";
	_progress_cb   	= progress_cb;
	_completion_cb 	= completion_cb;
	_tables 		= [];

	if( _mode == "sync" ){
		// sync all except those in Datastore.Config.uploadOnly
		
		_tables = Datastore.Config.tables;
		//_tables = ["products"]; // for testing 

	
	}else if( _mode == "upload" ){
		_tables = Datastore.Config.uploadOnly;
	}

	_steps  = _tables.length;
	_step   = 0;

	console.log("= Datastore.Sync "+ _mode +" starting for ",_tables);
	if( _tables.length == 0 ){
		console.log('No tables, calling Done()');
		_done();
	}

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
	_completion_cb("", null);
}

function _next(){

	if( _stopped ){
		_stop();
		return;
	}
	if( !_running ){
		return;
	}

	if( _step < _steps ){
	
		_progress_cb( (_step+1), _steps, _tables[_step] );
	
	
		if( _mode == "sync" ){
			_check( _tables[_step] );
		}else if( _mode == "upload" ){
			_upload_table( _tables[_step] );
		}
	}else{
		
		_done();
	}

	_step ++;
}

function _progress(id, type){
	console.log("_progress:", id, type);
}

///////////////////////////////////////

var _upl_table = '';
var _upl_items = [];
var _upl_steps = 0;
var _upl_step  = 0;

function _upload_table(_table){

	_step++;

	if( !Datastore.findTable(_table) ){
		console.log("Datastore.Sync.Check: Unknown table", _table);
		return _next();
	}

	// A registration is a composit of other objects
	// so we create a unique name for them (so they can be stored and indexed like the other datatypes)
	
	// Upload each item sequencially to the server
	// add $uploaded=true on response=ok
	// and save back to localstorage
	
	// then solve its images

	_upl_table = _table;

	Datastore.all(_table, function(items){


		console.log('## unfiltered:', items);

		_upl_items = items.filter( function(el){ return !el.uploaded } );
		_upl_steps = _upl_items.length;
		_upl_step  = 0;

		console.log('## filtered:', _upl_items);
		console.log('## filtered _upl_steps:', _upl_steps, "_upl_step:", _upl_step);

		_upl_steps

		if( _upl_steps == 0 ){
			console.log('Upload: No items to upload in table ', _table);
			_next();

		}else{
			console.log("% Starting _upload_items ", items);
			console.log("_upl_steps:", _upl_steps );
			_upload_next();
		}
	});
}

function _upload_next(){
	_progress_cb( (_upl_step+1), _upl_steps, _upl_table );

	if( _upl_step < _upl_steps ){
		_upload_item( _upl_items[_upl_step] )
	}else{
		console.log('all ', _upl_steps, ' records in table ', _upl_table ," uploaded!");

		Datastore.all("registrations", function(items){	
			items.forEach( function(el){
				console.log('## Listing Table "registrations":', el.name, "uploaded:", el.uploaded);	
			});			
		});

		_next();
	}
}
function _upload_item_uploaded( _item, _response ){
	//console.log('_upload_item_uploaded: ', _item, _response);

	// Flag as uploaded:
	_item.uploaded = true;

	// Save it
	console.log('### _upload_item_uploaded >> MARK AS UPLOADED:', _upl_table, _item._id, _item.name );
	Datastore.put(_upl_table, _item._id, _item);


	_upl_step ++;
	_upload_next();
}

function _upload_item( _item){
	//console.log('## _upload_item', _item);

	xhr({
		'method':'PUT', 
		'json':{name: _item.name, data:_item},
		'uri': Datastore.Config.server +'/'+ _upl_table,
		'headers': {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': Datastore.Config.auth_token
		},
		'timeout': Datastore.Config.timeout
	}, function (err, resp, body){
			console.log("% Received response for ", _upl_table, body.msg );
			//console.log("diff err, resp, body:", err, resp, body );

			if( err ){
				_completion_cb("Network error", true);
			}else{
				_upload_item_uploaded( _item, body.msg );
			}
			/*
			}else if( body.status == 'error' ){
				//_completion_cb("Error: "+ body.msg, true);
			
			}else if( body.status == 'ok' ){
				//_apply( body.msg );
				console.log('############ upload response', body.msg);
				_upload_item_uploaded( _item, body.msg );
 			}
 			*/	
		}
	);
}	

///////////////////////////////////////

function _check(_table){
	if( !Datastore.findTable(_table) ){
		console.log("Datastore.Sync.Check: Unknown table", _table);
		return _next();
	}

	Datastore.all(_table, function(items){

		_progress("% Starting ", _table );

		console.log('%% local items in table', _table, ":", items);

		xhr({
			'method':'POST', 
			'json':{list: items},
			'uri': Datastore.Config.server +'/'+ _table +'/diff',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Auth-Token': Datastore.Config.auth_token
			},
			'timeout': Datastore.Config.timeout
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

	//console.log('_apply:: all in '+ table, Datastore.all(table) );

	_next();
}
