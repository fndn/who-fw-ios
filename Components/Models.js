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

var ageGroups = t.enums({
    0: '≤ 3 month',
    1: '4 month',
    2: '5 month',
    3: '6 month',
    4: '7 month',
    5: '8 month',
    6: '9 month',
    7: '10 month',
    8: '11 month',
    9: '12 month',
    10: 'Other'
});

var foodTypes = t.enums({
    0: 'Cereal/Porridge',
    1: 'Mock Meal',
    2: 'Yoghurt or Yogurt-related',
    3: 'Fruit/Vegable purée',
    4: 'Biscuit/Wafers/Crisps',
    5: 'Breast Milk Substitute',
    6: 'Follow-on Formula',
    7: 'Smoothie/Other Drinks',
    8: 'Other'
});


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
        name: t.Str,
        foodType: foodTypes,
        ageGroup: ageGroups
    });
};

module.exports.Nutrition = function(){
    return t.struct({
        'Energy (KJ)': t.Num,
        'Energy (kcal)': t.Num,
        'Fat (g)': t.Num,
        'Fat of which saturates (g)': t.Num,
        'Fat of which trans (g)': t.Num,
        'Carbohydrate (g)': t.Num,
        'Carbohydrate of which sugars (g)': t.Num,
        'Carbohydrate of which lactose (g)': t.Num,
        'Protein (g)': t.Num,
        'Salt (g)': t.Num,
        'Sodium (g)': t.Num
    })
};

module.exports.NutritionServing = function(){
    return t.struct({
        'Serving size (g)': t.Num,
        'Energy (KJ)': t.Num,
        'Energy (kcal)': t.Num,
        'Fat (g)': t.Num,
        'Fat of which saturates (g)': t.Num,
        'Fat of which trans (g)': t.Num,
        'Carbohydrate (g)': t.Num,
        'Carbohydrate of which sugars (g)': t.Num,
        'Carbohydrate of which lactose (g)': t.Num,
        'Protein (g)': t.Num,
        'Salt (g)': t.Num,
        'Sodium (g)': t.Num
    })
};