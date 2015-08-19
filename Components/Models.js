'use strict';

var React 	= require('react-native');
var t 	 	= require('tcomb-form-native');

// Models


module.exports.Country = function(){
	return t.struct({
		name: t.Str,
		countryCode: t.maybe(t.Str)
	});
};

module.exports.Location = function(){
	var countries = {};
	Datastore.all("countries").forEach(function(c){
		countries[ c.name.toLowerCase() ] = c;	
		console.log('countries', countries);
	});
	console.log('countries', countries);
	/*var incomeTypes = {};
	Datastore.all("incomeTypes").sort().forEach(function(c){
		incomeTypes[ c.toLowerCase() ] = c;	
	});*/

var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});


	return t.struct({
		name: t.Str,
		street: t.Str,
		streetNumber: t.Num,
		postCode: t.Str,
		postArea: t.Str,
		//IncomeType: t.enums(incomeTypes),
		country: Gender
	});
};
