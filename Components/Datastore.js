'use strict';

var React = require('react-native');

var Datastore = {};

Datastore.Get = function(list){

	switch( list ){
		case 'countries':
			return [
					{"_id": 1, "name": "dk"},
					{"_id": 2, "name": "se"},
					{"_id": 3, "name": "no"},
					{"_id": 4, "name": "gb"}
				];
			break;

		case 'areas':
			return [
					{"_id": 1, "name": "dk"},
					{"_id": 2, "name": "se"},
					{"_id": 3, "name": "no"},
					{"_id": 4, "name": "gb"}
				];
			break;

		default:
			console.log("Datastore Unkown list '"+ list +"'");
			return [];

	}

}

module.exports.Get = Datastore.Get;

var localData = {};
Datastore.Set = function(key, value){
	localData[key] = value;
}

module.exports.Set = Datastore.Set;


/**/
/*
Datastore.Sesssion.Create();

Datastore.Sesssion.Set('country', 'dk');

Datastore.Sesssion.AddCountry( {} ); // add to List<Countries>
Datastore.Sesssion.AddProduct( {} ); // add to list<Products>
*/