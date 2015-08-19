'use strict';

var React 	    = require('react-native');
var t 	 	    = require('tcomb-form-native');
var Datastore    = require('./Datastore');

// Enums
var incomeTypes = t.enums({
    L: 'Low',
    H: 'High'
});

var storeTypes = t.enums({
    0: 'Supermarket',
    1: 'Pharmacy',
    2: 'Convinience store/corner shop',
    3: 'Health Food store',
    4: 'Department Store',
    5: 'Mini-market',
    6: 'Other'
});

// Models

module.exports.Respondent = function(){
    return t.struct({
        name: t.Str,
        affiliation: t.Str
    });
};

module.exports.Country = function(){
	return t.struct({
		name: t.Str,
		countryCode: t.maybe(t.Str)
	});
};

module.exports.Location = function(){
	return t.struct({
		city: t.Str,
		neighbourhood: t.Str,
        street: t.maybe(t.Str),
        incomeType: incomeTypes
	});
};

module.exports.StoreType = function(){
    return t.struct({
        storeType: storeTypes
    });
};

module.exports.Brand = function(){
    return t.struct({
        name: t.Str
    });
};

module.exports.Product = function(){
    return t.struct({
        name: t.Str
    });
};