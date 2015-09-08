
// integrates with fndn-mirror on the server

/*
Q: Should Products Sync?

-- 

A Registration is basically the confirmed placement of
a given Product on a given Location (by a given Respondent)

reg = {'respondent': {name, affiliation}, 'location':{county, city, street, type}, 'product':{name, brand, nutrients}}

The Registrations does not Sync - only upload (PUT).
Its difficult to bring CameraRoll images into JS from Obj-C, so file-uploads are handled with a native plugin.

So how do we connect a Product to its images?

imageNames = [{file:2308f203f8, name:Side2}, {file:r31d1j23f23f23, name:Front}]
network.api.put(product, function(err, res){
	id = res.id;
	product.imageNames = product.imageNames.map( function(el){ el.name=id+'_'+el.name; return el; });
	FileUpload.send(images, imageNames);
	// should we re-post the product so product.imageNames are correct?
})

*/

var Datastore 	= require('./Datastore');
var xhr 		= require("xhr");

// var FileUpload = require('NativeModules').FileUpload; // ?

var _table = '';
var _running = false;
var _progress_cb = null;
var _completion_cb = null;
var _step = 0;
var _steps = 0;
var _items = [];
var _item = {};

var _stopped = false;
var _mode = "sync";

var jsonHeaders = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-Auth-Token': Datastore.Config.auth_token
};

module.exports.Upload = function(table, progress_cb, completion_cb){
	if( _running ){
		console.log( "Upload already running" );
		return;
	}

	console.log('= Datastore.Upload Starting');
	_running = true;

	_table = table;

	_progress_cb = progress_cb;
	_completion_cb = completion_cb;
	_stopped = false;

	Datastore.all(_table, function(items){
		_items = items.filter( function(el){ return el.uploaded != true } );
		_step  = 0;
		_steps = _items.length;
		

		console.log('Begin upload of ', _steps, "items:", _items );
		_send();
	});
}

function _next(){
	_progress_cb("% Upload step ", _step, _steps );

	_step ++;
	if( _step >= _steps ){
		_progress_cb("% Upload done ", _steps, _steps );
		_completion_cb("% Upload completed");
	}else{
		_send();
	}
}

function _send(){

	// check fileupload and upload progress event

	_item = _items[_step];

	var x = xhr({
		'method':'PUT', 
		'json':{item: _item },
		'uri': Datastore.Config.server +'/'+ _table,
		'headers': {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': Datastore.Config.auth_token
		},
		'timeout': Datastore.Config.timeout
	}, function (err, resp, body){
			_progress_cb("% Received response for ", table, resp, body );
			//console.log("diff err, resp, body:", err, resp, body );

			if( err ){
				_completion_cb("Network error", true);

			}else if( body.status == 'error' ){
				_completion_cb("Error: "+ body.msg, true);

			}else if( body.status == 'ok' ){
				//_apply( body.msg );
				_item.uploaded = true;
				_item.uploaded_at = Date.now();
				_item.save( function(err, res){
					console.log('Item Upload complete, flagged item', _item, err, res );
					//_next();
				});
			}
		}
	);
}