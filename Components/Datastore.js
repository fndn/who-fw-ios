'use strict';

var ReactNativeStore	= require('../react-native-store');
var Config  			= require('./Datastore.Config');
var DatastoreTests 		= require('./Datastore.Tests');
var DatastoreSync 		= require('./Datastore.Sync');


module.exports.MemoryStore = {};	// shared global store


var Datastore 	 		= {};
Datastore.tables 		= {}; 	// memorymapped async store

var _instance = false; 	// ensure singleton
var _initialized = -1; 	// -1: not ready, 0:loading, 1: ready
var _init_queue = [];
function _process_init_queue(){

	_initialized = 1;

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
	//DatastoreTests.RunDatastoreTests();
	//DatastoreTests.RunDiffTest();
	//DatastoreTests.RunSyncTest();
	
	
}

var init = module.exports.init = function( cb ){
	//console.log('= Datastore: init (_instance:', _instance, "_initialized:", _initialized, ")");
	if( !_instance ){
		_instance = true;
		_initialized = 0;
		console.log('= Datastore: initializing Datastore =');

		ReactNativeStore.setDbName( Config.database );

		var len = Config.tables.length;
		for(var i = 0; i<len; i++){
			ReactNativeStore.table( Config.tables[i] ).then(function(_table){
				//_table.removeAll(); // reset local store
				console.log("Connecting table "+ _table.tableName );
				Datastore.tables[_table.tableName] = _table;
				if( Object.keys(Datastore.tables).length == len ){
					_process_init_queue();
				}
			});
		}
		
	}else{
		_init_queue.push(cb);
	}
}


// returns count of items in a table
Datastore.count = module.exports.count = function(_table){
	var table = _findTable(_table);
	if( table ){
		return table.databaseData[_table].totalrows;
	}
}

// findAll, returns list
Datastore.all = module.exports.all = function(_table, cb){

	if( !_initialized ){
		console.log("adding ds.all to _init_queue");
		_init_queue.push(function(){ Datastore.all(_table, cb) });
		return;
	}

	var table = _findTable(_table);
	if( table ){
		
		var obj = table.findAll();

		obj = sortByKey(obj, "name");

		if( typeof cb == 'function'){
        	cb(obj);
        }else{
        	return obj;
        }

		/*
        // ignore empty items
        var sl = Object.keys(DefaultData[_table][0]).length;
        //console.log("SL:", sl);
        var items = table.findAll();
        var obj = [];
        items.forEach( function (itm){
            //console.log("#", itm )
            if( Object.keys(itm).length >= sl){

                // igonre empty objects
                var vals = [];
                for( var v in itm){
                    vals.push(itm[v]);
                }
                //console.log("vals", vals);
                //console.log(vals.join(""));
                if( vals.join("") != "" && (vals.join("") % 1) !== 0){
                    obj.push( itm );
                }
            }
        });
        //return obj;

        if( typeof cb == 'function'){
        	cb(obj);
        }else{
        	return obj;
        }
        */
	}
}


// findOne, returns item
Datastore.one = module.exports.one = function(_table, _id){
	var table = _findTable(_table);
	if( table ){
		return table.get(_id);
	}
}

// create, returns insertID
Datastore.add = module.exports.add = function(_table, _obj){
	var table = _findTable(_table);
	if( table ){

		console.log('add _obj', _obj, typeof _obj);
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

		return table.add(_obj);
	}
}


// remove, returns insertID(?)
Datastore.del = module.exports.del = function(_table, _id){
	var table = _findTable(_table);
	if( table ){
		return table.removeById(_id);
	}
}


// findOneAndUpdate, updates key (single or object) in an existing record 
Datastore.put = module.exports.put = function(_table, _id, _key, _val){
	var table = _findTable(_table);
	if( table ){
		var data = table.get(_id)[0];
		if( typeof _key === 'string'){
			data[_key] = _val;
		}else{
			// assume key is an object
			for( var k in _key){
				data[k] = _key[k];
			}
		}
		return table.updateById(_id, data);
	}
}

// Internal

// Creates a new record if it does not exist
Datastore.putx = function(_table, _obj){
	var table = _findTable(_table);
	if( table ){
		var data = table.where( _obj  ).limit(1).find();
		//console.log(_table, '@1 data', data, data.length);
		if( data.length == 0 ){
			// item does not exist. Add it.
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
		console.log("= Datastore: Cleared table "+ _table );
		//_setDefaults( DefaultData );
	});
}


// Utilities
function _findKey( key, obj ){
	if( Object.keys(obj).indexOf(key) > -1 ){
		return obj[key];
	}else{
		console.log('_findKey '+ key +' in '+ obj +' : NOT FOUND');
		return false;	
	}
}
function _findTable( _table ){
	if( Object.keys(Datastore.tables).indexOf(_table) > -1 ){
		return Datastore.tables[_table];
	}else{
		console.log('_findTable '+ _table +' : NOT FOUND');
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
