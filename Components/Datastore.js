'use strict';

var React 				= require('react-native');
var ReactNativeStore	= require('../react-native-store');
var DefaultData			= require('../DefaultData.js');

/**

todo:
- load lists (Defaults from server)
- get Model interface (tcomb)
- Sync (use fndn/mirror)



**/

//var t = require('tcomb-form/lib');

/**

clientside store structure

All schema and data should be update-able from server
- possibly with a transcode to t<Type> structures?

// Generic lists shared by all countries:

Datastore.List = {
	Countries : [
		{id, iso, name},
	],

	IncomeTypes: [
		{id, name}
	],

	StoreTypes: [
		{id, name}
	],

	AgeGroups: [
		{id, name}
	],

	Categories: [
		{id, name}
	],

	Brands: {
		{id, name, logo, icon}
	}
}

// Models
Datastore.Models = {
	Location: {
		
	},

	Respondent: {
		{id, name, affiliation}
	},

	Ingredients: {
	
	},

	Nutritions: {
	
	}

	Product: {
		{id, brand_id, agegroup_id, category_id, name, }
	}

}

**/


var Datastore 	 = {};
Datastore.tables = {}; 	// memorymapped async store

var _instance = false; 	// ensure singleton
var _initialized = -1; 	// -1: not ready, 0:loading, 1: ready
var _init_queue = [];
function _process_init_queue(){
	console.log("= Datastore: _process_init_queue()");
	_initialized = 1;
	for(var fn in _init_queue ){
		console.log('= Datastore: Calling Queued FN', _init_queue[fn]);
		_init_queue[fn]();
	}
	_init_queue = [];
	console.log("= Datastore: Ready");
}

var init = module.exports.init = function( cb ){
	console.log('= Datastore: init (_instance:', _instance, "_initialized:", _initialized, ")");
	if( !_instance ){
		_instance = true;
		_initialized = 0;
		console.log('= Datastore: initializing Datastore (once)');

		//Datastore._clear("countries");
		
		_setDefaults( DefaultData ); //TODO: Call this with server-loaded "defaults"
		//_test();

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
	});

	// TODO
	// resolve mismatch between server and local _id's
	// if there is rows in localStore NOT present in _defaults, send them to the server
}

function _populate(_tableNames, cb){
	console.log('= Datastore: Populating from AsyncStorage');
	var len = _tableNames.length;
	for(var i = 0; i<len; i++){
		ReactNativeStore.table( _tableNames[i] ).then(function(_table){
			//console.log("created table ", _table, "name:", _table.tableName );
			Datastore.tables[_table.tableName] = _table;
			if( Object.keys(Datastore.tables).length == len ){
				_process_init_queue();
				cb();
			}
		});
	}
}



// utility
function _findTable( _table ){
	if( Object.keys(Datastore.tables).indexOf(_table) > -1 ){
		return Datastore.tables[_table];
	}else{
		console.log('_findTable '+ _table +' : NOT FOUND');
		return false;	
	}
}

// findAll, returns list
Datastore.all = module.exports.all = function(_table){
	var table = _findTable(_table);
	if( table ){
		// todo: Alpha sort on $orderBy || $name 
		return table.findAll();
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

		//console.log("adding obj 1:", _obj, typeof _obj, Object.keys(_obj), DefaultData[_table], DefaultData[_table][0]);
		var schema = DefaultData[_table][0];
		delete(schema._id);
		// if..
		var obj = {};
		Object.keys(schema).forEach( function(el){
			if( _obj[el] == null || _obj[el] == undefined ) _obj[el] = '';
			obj[el] = _obj[el];
		});
		console.log('Adding', obj, 'to', _table);

		return table.add(obj);
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
		console.log(_table, '@1 data', data, data.length);
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