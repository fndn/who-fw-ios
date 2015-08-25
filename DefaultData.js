/*
module.exports = {

	"incomeTypes" : [
		{'name': 'Low-income area'},
		{'name': 'High-Income area'}
	],

    "storeTypes" : [
        {'name': 'Supermarket'},
        {'name': 'Pharmacy'},
        {'name': 'Convenience store/corner shop'},
        {'name': 'Health Food store'},
        {'name': 'Department Store'},
        {'name': 'Mini-market'},
        {'name': 'Other'}
    ],


	// user created data
    "countries" : [
        {"name": "Denmark", "countryCode":'dk'},
        {"name": "Sweden",  "countryCode":'sw'},
        {"name": "Norway",  "countryCode":'no'},
        {"name": "Finland", "countryCode":'fi'}
    ],

    "locations": [
        {'city':'', 'neighbourhood':'', 'street':'', 'incomeType':'', 'countryId':''}
    ],

    "brands" : [
        {'name':''}
    ],

    "items": []
};
*/

var storeTypes = {"storeTypes" : [
    {'name': 'Supermarket'},
    {'name': 'Pharmacy'},
    {'name': 'Convenience store/corner shop'},
    {'name': 'Health Food store'},
    {'name': 'Department Store'},
    {'name': 'Mini-market'},
    {'name': 'Other'}
]};

module.exports.tables = ["reg-test", "countries", "locations", "brands", "products", "incomeTypes", "storeTypes"];