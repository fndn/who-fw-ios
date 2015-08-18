'use strict';

var React = require('react-native');
var ReactNativeStore = require('react-native-store');

var countries;
ReactNativeStore.table("countries").then(function(_countries){
	countries = _countries;

	var c = countries.get(1);
	console.log('c', c, c.length);

	if( countries.get(1).length === 0 ){
		["dk", "se", "no"].map( function(country){
			console.log("adding country:"+ country );
			countries.add({'name': country});
		});
	}

	console.log('countries.find():', countries.find() );
	console.log('countries.findAll():', countries.findAll() );

	console.log('countries.rows:', countries );

	console.log('countries.rows:', countries.databaseData.countries.rows );
	
});
/*
    // Add Data
    var id = articles.add({
         title: "Title",
         content: "This is a article"
    });

    console.log(id); //row id

});
*/

var Datastore = {};

Datastore.Get = function(list){

	switch( list ){
		case 'countries':

			// works if the $countries promise have been resolved
			if( countries ) console.log('LATER countries.findAll():', countries.findAll() );

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