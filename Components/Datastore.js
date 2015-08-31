'use strict';

var ReactNativeStore	= require('../react-native-store');

var Config  			= require('./Datastore.Config');
module.exports.Config   = Config;

var Remote  			= require('./Datastore.Remote');
module.exports.Remote   = Remote;

var DatastoreSync 		= require('./Datastore.Sync');
module.exports.Sync   	= DatastoreSync.Sync;

var DatastoreInit 		= require('./Datastore.Init.Server');
var DatastoreTests 		= require('./Datastore.Tests');

var shortid 			= require('shortid');
module.exports.ShortID  = shortid;

var MemoryStore 		= module.exports.MemoryStore = {};	// shared global store


var Datastore 	 		= {};
Datastore.tables 		= {}; 		// memorymapped async store

var _instance 			= false; 	// ensure singleton
var _initialized 		= -1; 		// -1: not ready, 0:loading, 1: ready
var _init_queue 		= [];

var _subscribers 		= {};
var _lastAnnoncement 	= Date.now();

module.exports.OnChange = function(table, fn_subscriber){
	//console.log('[Datastore] 1 ADD OnChanged', table, fn_subscriber );

	if( Object.keys(_subscribers).indexOf(table) < 0 ){
		_subscribers[table] = [];
	}

	if( _subscribers[table].indexOf(fn_subscriber) < 0 ){
		_subscribers[table].push( fn_subscriber );
		//console.log('[Datastore] 2 ADD OnChanged', _subscribers );
	}
}
function _announceChange(table){
	//console.log('_announceChange() typeof _subscribers[table]:', typeof _subscribers[table], _subscribers[table], "since:", (Date.now() - _lastAnnoncement), "length:", _subscribers[table].length, "Object.keys(_subscribers).indexOf(table):", Object.keys(_subscribers).indexOf(table) );

	if( Object.keys(_subscribers).indexOf(table) < 0 ) return;
	if( typeof _subscribers[table] != 'object') return;
	if( _subscribers[table].length == 0) return;

	if( Date.now() - _lastAnnoncement < 1000 ) return;

	for( var fn in _subscribers[table] ){
		console.log('_announceChange() ANNONUNCING', table, fn, _subscribers[table][fn] );
		_subscribers[table][fn]( Datastore.last(table) );
	}
	_lastAnnoncement = Date.now();
}

function _process_init_queue(){

	_initialized = 1;

	//console.log("= Datastore: _process_init_queue", _init_queue);

	if( _init_queue.length ){
		console.log("= Datastore: Processing Queue");
		
		for(var fn in _init_queue ){
			console.log('  Datastore: Calling queued FN', _init_queue[fn]);
			_init_queue[fn]();
		}
		_init_queue = [];
	}
	console.log("= Datastore: Ready");

	// Run tests ----------------------------------------------------

	//console.log('DS all countries >  ', Datastore.all('countries') );

	//console.log('DS all registrations >  ', Datastore.all('registrations') );

	//console.log('DS all credentials >  ', Datastore.all('credentials') );


	//DatastoreInit.Run();

	//DatastoreTests.RunDatastoreTests();
	//DatastoreTests.RunDiffTest();
	

	//DatastoreTests.RunNetworkReachabilityTest();
	

	//DatastoreTests.RunSyncTest();
	//DatastoreTests.RunUploadTest();
	
}

var init = module.exports.init = function( cb ){
	//console.log('= Datastore: init (_instance:', _instance, "_initialized:", _initialized, ")");
	if( !_instance ){
		_instance = true;
		_initialized = 0;
		console.log('= Datastore: initializing Datastore');

		if( cb ){
			_init_queue.push(cb);
		}

		ReactNativeStore.setDbName( Config.database );

		_setup();

	}else{
		_init_queue.push(cb);
	}
}

function _setup(){
	console.log('= Datastore: Creating Tables:');

	var _tables = new Array();
	_tables = _tables.concat(Config.tables);
	_tables = _tables.concat(Config.uploadOnly);
	_tables = _tables.concat(Config.localOnly);

	var len = _tables.length;
	for(var i = 0; i<len; i++){
		ReactNativeStore.table( _tables[i] ).then(function(_table){

			//console.log('_table', _table);

			if( _table.tableName == "registrations"){
				//_table.removeAll();	
			}
			//_table.removeAll(); // reset local store

			//console.log("= Datastore: Connecting table "+ _table.tableName );
			console.log("  + "+ _table.tableName );
			Datastore.tables[_table.tableName] = _table;
			if( Object.keys(Datastore.tables).length == len ){
				_process_init_queue();
			}
		});
	}
}

// returns count of items in a table
Datastore.count = module.exports.count = function(_table){
	var table = _findTable(_table);
	if( table ){
		return table.databaseData[_table].totalrows;
	}
}

Datastore.countWhereNo = module.exports.countWhereNo = function(_table, key){
	var table = _findTable(_table);
	if( table ){
		var items = table.findAll();
		items = items.filter( function(el){ return !el[key] } );
		return items.length;
	}
}



// findAll, returns list
Datastore.all = module.exports.all = function(_table, cb){

	if( !_initialized ){
		console.log("adding ds.all@"+ _table +" to _init_queue");
		_init_queue.push(function(){ Datastore.all(_table, cb) });
		return;
	}

	
	var table = _findTable(_table);
	if( table ){
		
		var obj;

		if( _table == 'registrations' ){
			
			//console.log('### registrations DBB', table );
			obj = table.findAll();

		}else{

			if( _table == 'locations' &&  MemoryStore.country ){
				// filter by country
				//console.log("DATASTORE: FILTERING ", _table, " on MS.COUNTRY", MemoryStore.country.name,  "MemoryStore:", MemoryStore );
				obj = table.where({'country': MemoryStore.country.name}).find();
			
			}else if( _table == 'products' &&  MemoryStore.brand ){
				// filter by brand
				//console.log("CDATASTORE: FILTERING ", _table, " on MS.BRAND", MemoryStore.brand.name,  "MemoryStore:", MemoryStore );
				obj = table.where({'brand': MemoryStore.brand.name}).find();

			}else{
				// un-filtered
				//console.log("DATASTORE: all@"+ _table );
				obj = table.findAll();
			}

			obj = sortByKey(obj, "name");

		}
		

		if( typeof cb == 'function'){
        	cb(obj);
        }else{
        	return obj;
        }

	}
}


// findOne, returns item
Datastore.one = module.exports.one = function(_table, _id){
	var table = _findTable(_table);
	if( table ){
		return table.get(_id)[0];
	}
}


// returns the record with highest _id
Datastore.last = module.exports.last = function(_table){
	var table = _findTable(_table);
	if( table ){
		return (table.findAll()).slice(-1)[0];
	}
}


// create, returns insertID
Datastore.add = module.exports.add = function(_table, _obj){
	var table = _findTable(_table);
	if( table ){

		//console.log('DS '+ _table +' add _obj', typeof _obj, _obj, "name:", _obj.name);

		//TODO: Do we need a Duplicate check ?

		/*
		//console.log("adding obj 1:", _obj, typeof _obj, Object.keys(_obj), DefaultData[_table], DefaultData[_table][0]);
		var schema = DefaultData[_table][0];
		delete(schema._id);
		//TODO: if no schema...?
		var obj = {};
		Object.keys(schema).forEach( function(el){
			//console.log(el, _obj[el]);
			if( _obj[el] == null || _obj[el] == undefined ){
				//console.log('handling nil');
				obj[el] = '';
			}else{
				obj[el] = _obj[el];
			}
		});
		console.log('Adding', obj, 'to', _table);
		*/
		var ok = table.add(_obj);
		//console.log('DS '+ _table +' add _obj >> ', ok);

		setTimeout( function(){ _announceChange(_table) }, 10);
		return ok;
	}
}


// remove, returns insertID(?)
Datastore.del = module.exports.del = function(_table, _id){
	var table = _findTable(_table);
	if( table ){
		setTimeout( function(){ _announceChange(_table) }, 10);
		return table.removeById(_id);
	}
}


// findOneAndUpdate, updates key (single or object) in an existing record 
Datastore.put = module.exports.put = function(_table, _id, _key, _val){
	//console.log("Datastore.put() called with", _table, _id, _key, _val);
	var table = _findTable(_table);
	if( table ){
		var data;
		try {
			data = table.get(_id);
		}catch(e){
			//console.log('FIRST PUT Error', e);
			//console.log('  table', table);
			//console.log('  this.databaseData[this.tableName]:', this.databaseData[this.tableName]);
			//return table.add(_key);
			return;
		}

		//console.log("Datastore.put:", _table, data, typeof data );
		if( data == undefined ){
			//console.log("Datastore.put ADDING");
			setTimeout( function(){ _announceChange(_table) }, 10);
			return table.add(_key);
		}else{
			if( data.length > 0 ) data = data[0];
			//console.log("Datastore.put UPDATING");
			if( typeof _key === 'string'){
				data[_key] = _val;
			}else{
				// assume key is an object
				for( var k in _key){
					data[k] = _key[k];
				}
			}
			setTimeout( function(){ _announceChange(_table) }, 10);
			return table.updateById(_id, data);
		}
	}
}

// Internal

// Creates a new record if it does not exist
Datastore.putx = module.exports.putx = function(_table, _obj){
	var table = _findTable(_table);
	if( table ){
		var data = table.where( _obj  ).limit(1).find();
		//console.log("Datastore.putx:", _table, '@1 data', data, data.length);
		//if( data.length == 0 ){
		if( data == undefined ){
			// item does not exist. Add it.
			setTimeout( function(){ _announceChange(_table) }, 10);
			return table.add(_obj);
		}else{
			return -1;
		}
	}
}


Datastore._clear = function(_table){
	ReactNativeStore.table( _table )
	.then(function(table){
		table.removeAll();
	})
	.then(function(b){
		//console.log("= Datastore: Cleared table "+ _table );
		//_setDefaults( DefaultData );
	});
}


// Utilities
function _findKey( key, obj ){
	if( Object.keys(obj).indexOf(key) > -1 ){
		return obj[key];
	}else{
		//console.log('_findKey '+ key +' in '+ obj +' : NOT FOUND');
		return false;	
	}
}
function _findTable( _table ){
	if( Object.keys(Datastore.tables).indexOf(_table) > -1 ){
		return Datastore.tables[_table];
	}else{
		//console.log('_findTable '+ _table +' : NOT FOUND');
		return false;	
	}
}
module.exports.findTable = _findTable;



// http://stackoverflow.com/a/14463464/1993842

/*
function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}
*/
function sortByKey(array, key) {
    return array.sort(function(a, b) {

    	if( !a.hasOwnProperty(key) || !a.hasOwnProperty(key) ){
    		return false;
    	}

        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var cloneObject = module.exports.cloneObject = function(o){
	if (o === null || typeof o !== 'object') return o;

	var r = {};
	for(var k in o)	r[k]=o[k]

	return r;
};

function remove_ids(objArr){

	//console.log('---------- IN ----------');
	//console.log(objArr);
	//console.log('------------------------');

	var rarr = {};
	for(var a in objArr){
		var robj = {};
		//console.log('remove_ids > typeof objArr[a]', typeof objArr[a], objArr[a]);
		if( objArr[a] == null || typeof objArr[a] != 'object' ){
			rarr[a] = objArr[a];
		}else{
			var keys = Object.keys( objArr[a] );
			for( var k in keys ){
				var key = keys[k] 
				if( key != '_id' ){
					robj[ key ] = _remove_ids( objArr[a][key] ); 
				}
			}
			rarr[a] = robj;
		}
	}
	//console.log('---------- OUT ----------');
	//console.log(rarr);
	//console.log('--------------------------');

	return rarr;
}
function _remove_ids(obj){
	//console.log('_remove_ids > typeof obj', typeof obj, obj);
	if( obj == null || typeof obj != 'object' ) return obj;
	
	var robj = {};
	var keys = Object.keys( obj );
	for( var k in keys ){
		var key = keys[k];
		if( key != '_id' ){
			robj[ key ] = obj[key]; 
		}
	}
	return robj;
}
module.exports.removeIDs = remove_ids;
