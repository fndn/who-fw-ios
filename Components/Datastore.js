'use strict';

var ReactNativeStore	= require('../react-native-store');
var DefaultData			= require('../DefaultData.js');
var DatastoreTests 		= require('./DatastoreTests');


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
	//_test();
	//console.log('DS all countries >  ', Datastore.all('countries') );
	//DatastoreTests.RunDiffTest();
	//DatastoreTests.RunSessionTests();
	//DatastoreTests.RunSimpleSessionTests();
	//or
	//Session.Start(1); // or the id of an existing session
	//Session.Show();

	//DatastoreTests.RunNetworkTests();
	//DatastoreTests.RunDiffTest();
}

var init = module.exports.init = function( cb ){
	//console.log('= Datastore: init (_instance:', _instance, "_initialized:", _initialized, ")");
	if( !_instance ){
		_instance = true;
		_initialized = 0;
		console.log('= Datastore: initializing Datastore =');
		console.log('  tables', DefaultData.tables );

		/*
		// Connect to Session table
		ReactNativeStore.table( Session.tableName ).then(function(_table){
			_table.removeAll();
			Session.table = _table;
			console.log("= Sessionstore: Ready");

			//_setDefaults( DefaultData );
		});
		*/

		var len = DefaultData.tables.length;
		for(var i = 0; i<len; i++){
			ReactNativeStore.table( DefaultData.tables[i] ).then(function(_table){
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

function _test(){
	var table = 'test_users';
	_populate( ['test_users', 'test_countries'], function(){
		console.log('---');
		console.log('_populate cb()');

		////console.log('add >  ', Datastore.add(table, {name:'js', age:40}) );
		////console.log('all >  ', Datastore.all(table) );
		////console.log('one 2 >', Datastore.one(table, 2) );
		//console.log('put 3 key >', Datastore.put(table, 3, 'age', 44) );
		//console.log('put 4 obj >', Datastore.put(table, 3, {'age':55}) );
		//////console.log('del 1 >', Datastore.del(table, 1) );

		//console.log('all >  ', Datastore.all(table) );

		//console.log('putx >  ', Datastore.putx(table, {name: 'js', age: 155}) );

		//console.log('all >  ', Datastore.all(table) );

		console.log('Datastore.Country Model', Datastore.Country() );
	});
}
/*
function _setDefaults( _defaults ){
	//console.log('_setDefaults() Defaults:', _defaults);
	//console.log('Object.keys(Defaults):', Object.keys(_defaults));


	// Load all tables defined in _defaults
	// Add any rows from _defaults that does not already exist (putx)
	// if the table does not exist, add all (putx)

	_populate( Object.keys(_defaults), function(){
		for( var t in _defaults ){
			//console.log('t', t);
			for( var item in _defaults[t] ){
				//console.log("t, item:", t, _defaults[t][item]);
				if( Datastore.putx(t, _defaults[t][item] ) > -1 ){
					//console.log("Added ", _defaults[t][item], " to ", t );
				} 
			}
			//console.log('all '+ t +' >  ', Datastore.all(t) );
		}
		_process_init_queue();
	});
}

function _populate(_tableNames, cb){
	console.log('= Datastore: Populating from AsyncStorage');
	var len = _tableNames.length;
	for(var i = 0; i<len; i++){
		ReactNativeStore.table( _tableNames[i] ).then(function(_table){
			//console.log("created table ", _table, "name:", _table.tableName );
			Datastore.tables[_table.tableName] = _table;
			if( Object.keys(Datastore.tables).length == len ){
				//_process_init_queue();
				cb();
			}
		});
	}
}
*/


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

		// todo: Alpha sort on $orderBy || $name 

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

Datastore.addraw = module.exports.addraw = function(_table, _obj){
	var table = _findTable(_table);
	console.log("addraw", _table);
	if( table ){
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


/*

discontinued ?!

var Session = {
	tableName: "session-dev",
	table: null,	// async store
	store: {}, 		// memory store
	sessionID: 0,
};



Session.Start = function(id){
	if( this.table.get(id).length === 0 ){
		console.log( "sessionID", id, "not found. Starting a new one");
		this.sessionID = this.table.add({'synced':false});
	}else{
		this.sessionID = id;
	}
	console.log(" this.sessionID:", this.sessionID );
}

Session.Set = function(key, value){
	this.store[key] = value;
	//console.log( this.store );
	// persist
	if( this.sessionID == 0 ){
		console.log("WARNING: sessionID is zero - did you forget to call Datastore.Session.Start() ?");
	}
	this.table.updateById(this.sessionID, this.store);
}
Session.Get = function(key){
	return this.store[key];// || false;
}
Session.Show = function(){
	console.log("Session.store:",  this.store );
	console.log("Session.table:",  this.table.findAll() );
}
module.exports.Session = Session;
*/