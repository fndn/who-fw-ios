'use strict';

var React 	    = require('react-native');
var t 	 	    = require('tcomb-form-native');
var Datastore 	= require('fndn-rn-datastore');

// Enums
var incomeTypes = t.enums({
	L: 'Low',
	H: 'High'
});

module.exports.incomeTypes = incomeTypes;

var storeTypes = t.enums({
	SUP: 'Supermarket',
	PHA: 'Pharmacy',
	CS: 'Convinience store/corner shop',
	HS: 'Health Food store',
	DS: 'Department Store',
	MM: 'Mini-market',
	OTHER: 'Other'
});

module.exports.storeTypes = storeTypes;


var ageGroups = t.enums({
	THREE:  '≤ 3 months',
	FOUR:   '4 months',
	FIVE:   '5 months',
	SIX:    '6 months',
	SEVEN:  '7 months',
	EIGHT:  '8 months',
	NINE:   '9 months',
	TEN:    '10 months',
	ELEVEN: '11 months',
	TWELVE: '12 months',
	OTHER: 'Other'
});

module.exports.ageGroups = ageGroups;

var foodTypes = t.enums({
	CP: 'Cereal/Porridge',
	MM: 'Mock Meal',
	YO: 'Yoghurt or Yogurt-related',
	FVP: 'Fruit/Vegable purée',
	BWC: 'Biscuit/Wafers/Crisps',
	BMS: 'Breast Milk Substitute',
	FF: 'Follow-on Formula',
	SD: 'Smoothie/Other Drinks',
	OTHER: 'Other'
});

module.exports.foodTypes = foodTypes;

// Models

module.exports.SimpelBool = function(){
	return t.struct({
	   boolValue: t.Bool
	});
};

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
	//var data = Datastore.data.all('storeBrands');
	
	var data = Datastore.data.where('storeBrands', {"countryCode": Datastore.M.country.countryCode });
    data = Datastore.data.orderBy(data, "name");

	var storeBrands = {};
	for(var i = 0; i < data.length; i++)
	{
		storeBrands[this.numberToLetters(data[i]._id)] = data[i].name;
	}


	return t.struct({
		name: t.Str,
		city: t.Str,
		neighbourhood: t.maybe(t.Str),
		street: t.Str,
		incomeType: incomeTypes,
		storeBrand: t.enums(storeBrands),
		storeType: storeTypes
	});
};

module.exports.numberToLetters = function(n) {
    var ordA = 'A'.charCodeAt(0);
    var ordZ = 'Z'.charCodeAt(0);
    var len = ordZ - ordA + 1;

    var s = "";
    while(n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
};

module.exports.letterToNumbers = function(string) {
    string = string.toUpperCase();
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sum = 0, i;
    for (i = 0; i < string.length; i++) {
        sum += Math.pow(letters.length, i) * (letters.indexOf(string.substr(((i + 1) * -1), 1)));
    }
    return sum;
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

// For registration
module.exports.StoreBrand = function(){
	return t.struct({
		name: t.Str
	});
};

module.exports.Product = function(){
	var data = Datastore.data.where('brands', {'country':Datastore.M.country.name});
    data = Datastore.data.orderBy(data, "name");
	var brands = {};
	//console.log('brands', data);
	for(var i = 0; i < data.length; i++)
	{
		brands[this.numberToLetters(data[i]._id)] = data[i].name;
	}

	return t.struct({
        brand: t.enums(brands),
		name: t.Str,
		foodType: foodTypes,
		ageGroup: ageGroups
	});
};

module.exports.ProductEvaluation = function(){
	return t.struct({
		name: t.Str,
		brand: t.Str,
		foodType: t.Str,
		ageGroup: t.Str
	});
};

module.exports.Nutrition = function(){
	return t.struct({
		energyKj: t.maybe(t.Num),
		energyKcal: t.maybe(t.Num),
		fat: t.maybe(t.Num),
		fatOfWhichSaturates: t.maybe(t.Num),
		fatOfWhichTrans: t.maybe(t.Num),
		carbohydrate: t.maybe(t.Num),
		carbohydrateOfWhichSugars: t.maybe(t.Num),
		carbohydrateOfWhichLactose: t.maybe(t.Num),
		protein: t.maybe(t.Num),
		//salt: t.maybe(t.Num),
		//sodium: t.maybe(t.Num)
	});
};

module.exports.NutritionServing = function(){
	return t.struct({
		servingSize: t.maybe(t.Num),
		energyKj: t.maybe(t.Num),
		energyKcal: t.maybe(t.Num),
		fat: t.maybe(t.Num),
		fatOfWhichSaturates: t.maybe(t.Num),
		fatOfWhichTrans: t.maybe(t.Num),
		carbohydrate: t.maybe(t.Num),
		carbohydrateOfWhichSugars: t.maybe(t.Num),
		carbohydrateOfWhichLactose: t.maybe(t.Num),
		protein: t.maybe(t.Num),
		//salt: t.maybe(t.Num),
		//sodium: t.maybe(t.Num)
	});
};


module.exports.VisualInformation = function(){
	return t.struct({
		cartoons: t.Bool,
		picturesOfInfantsOrYoungChildren: t.Bool,
		picturesOfMothers: t.Bool,
		comparativeClaims: t.Bool,
		nutrientContentClaims: t.Bool
	});
};

module.exports.HealthClaims = function(){
    return t.struct({
        noSalt: t.Bool,
        noSugar: t.Bool,
        noSweeteners: t.Bool,
        vitamins: t.Bool,
        noPreservatives: t.Bool,
        noStarch: t.Bool,
        noColors: t.Bool,
        noFlavours: t.Bool,
        glutenFree: t.Bool,
        organic: t.Bool,
        other: t.maybe(t.Str)
    });
};

module.exports.Responent = function(){
	return t.struct({
		name: t.Str,
		affiliation: t.Str
	});
};

module.exports.getKeyByValue = function(object, value)
{
    for(var i in object)
    {
        if(object[i] == value)
            return i;
    }
    return null;
};