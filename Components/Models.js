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
    THREE: '≤ 3 month',
    FOUR: '4 month',
    FIVE: '5 month',
    SIX: '6 month',
    SEVEN: '7 month',
    EIGHT: '8 month',
    NINE: '9 month',
    TEN: '10 month',
    ELEVEN: '11 month',
    TWELVE: '12 month',
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
	return t.struct({
		name: t.Str,
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
        name: t.maybe(t.Str),
        foodType: foodTypes,
        ageGroup: ageGroups
    });
};

module.exports.ProductEvaluation = function(){
    return t.struct({
        name: t.Str,
        foodType: t.Str,
        ageGroup: t.Str
    });
};

module.exports.Nutrition = function(){
    return t.struct({
        'EnergyKj': t.maybe(t.Num),
        'EnergyKcal': t.maybe(t.Num),
        'Fat': t.maybe(t.Num),
        'FatOfWhichSaturates': t.maybe(t.Num),
        'FatOfWhichTrans': t.maybe(t.Num),
        'Carbohydrate': t.maybe(t.Num),
        'CarbohydrateOfWhichSugars': t.maybe(t.Num),
        'CarbohydrateOfWhichLactose': t.maybe(t.Num),
        'Protein': t.maybe(t.Num),
        'Salt': t.maybe(t.Num),
        'Sodium': t.maybe(t.Num)
    })
};

module.exports.NutritionServing = function(){
    return t.struct({
        'ServingSize': t.maybe(t.Num),
        'EnergyKj': t.maybe(t.Num),
        'EnergyKcal': t.maybe(t.Num),
        'Fat': t.maybe(t.Num),
        'FatOfWhichSaturates': t.maybe(t.Num),
        'FatOfWhichTrans': t.maybe(t.Num),
        'Carbohydrate': t.maybe(t.Num),
        'CarbohydrateOfWhichSugars': t.maybe(t.Num),
        'CarbohydrateOfWhichLactose': t.maybe(t.Num),
        'Protein': t.maybe(t.Num),
        'Salt': t.maybe(t.Num),
        'Sodium': t.maybe(t.Num)
    })
};