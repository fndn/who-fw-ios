module.exports = {
	"countries" : [
		{"name": "Denmark", "countryCode":'dk'},
		{"name": "Sweden",  "countryCode":'sw'},
		{"name": "Norway",  "countryCode":'no'},
		{"name": "Finland", "countryCode":'fi'}
	],
	
	"incomeTypes" : [
		{'name': 'Low-income area'},
		{'name': 'High-Income area'}
	],

    "storeTypes" : [
        {'name': 'Supermarket'},
        {'name': 'Pharmacy'},
        {'name': 'Convinience store/corner shop'},
        {'name': 'Health Food store'},
        {'name': 'Department Store'},
        {'name': 'Mini-market'},
        {'name': 'Other'}
    ],

	// user created data
	"items": [],

    "locations": [
        {'city':'', 'neighbourhood':'', 'street':'', 'incomeType':'', 'countryId':''}
    ],

    // Chosen values for this session
    "sessionCountry" : []
};