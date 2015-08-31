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

/*
var visualInfo = t.enums({
    VICA: 'Cartoons',
    VIPC: 'Pictures of infants/young children',
    PM: 'Pictures of mothers',
    CC: 'Comparative claims',
    NCC: 'Nutrient content claims',
    HC: 'Health claims',
    OTHER: 'Other'
});

module.exports.visualInfo = visualInfo;*/



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
        name: t.Str,
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
        energyKj: t.maybe(t.Num),
        energyKcal: t.maybe(t.Num),
        fat: t.maybe(t.Num),
        fatOfWhichSaturates: t.maybe(t.Num),
        fatOfWhichTrans: t.maybe(t.Num),
        carbohydrate: t.maybe(t.Num),
        carbohydrateOfWhichSugars: t.maybe(t.Num),
        carbohydrateOfWhichLactose: t.maybe(t.Num),
        protein: t.maybe(t.Num),
        salt: t.maybe(t.Num),
        sodium: t.maybe(t.Num)
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
        salt: t.maybe(t.Num),
        sodium: t.maybe(t.Num)
    });
};


module.exports.VisualInformation = function(){
    return t.struct({
        cartoons: t.Bool,
        picturesOfInfantsOrYoungChildren: t.Bool,
        picturesOfMothers: t.Bool,
        comparativeClaims: t.Bool,
        nutrientContentClaims: t.Bool,
        healthClaims: t.Bool,
        other: t.Bool
    });
};

module.exports.Responent = function(){
    return t.struct({
        name: t.Str,
        affiliation: t.Str
    });
};