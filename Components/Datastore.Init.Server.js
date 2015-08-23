
// data init tool

var Config  	= require('./Datastore.Config');
var xhr 		= require("xhr");

var data = [
	{table:'incomeTypes', items: [
		{name: 'Low income'},
		{name: 'High income'}
	]},

	{table: 'storeTypes', items: [
		{name: 'Supermarket'},
		{name: 'Pharmacy'},
		{name: 'Convenience store / Corner shop'},
		{name: 'Health Food store'},
		{name: 'Department store'},
		{name: 'Mini-market'},
		{name: 'Other'}
	]}
];

var _index = 0;
var _step  = 0;

module.exports.Run = function(){
	_index = 0;
	_step  = 0;
	_send( data[_index] );
}

function _next(){
	_step ++;
	if( _step >= data[_index].items.length ){
		_list( data[_index] );
		_step = 0;
		_index ++;
		if( _index >= data.length ){
			_index = 0;
			_done();
		}else{
			_send( data[_index] );
		}
	}else{
		_send( data[_index] );
	}
}

function _done(){
	console.log('Done');
}

function _list(type){
	xhr({
		method:'GET',
		uri: Config.server +'/'+ type.table,
		'headers': {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': Config.auth_token
		}
	},
	function (err, resp, body){
		if( resp.statusCode == 200 ){
			console.log('list body:', body);
		}
	});
}

function _send(type){
	console.log('', type.table, type.items[_step] );
	//_next();

	xhr({
		method:'PUT',
		uri: Config.server +'/'+ type.table,
		json: type.items[_step],
		'headers': {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': Config.auth_token
		},

	},
	function (err, resp, body){
		if( resp.statusCode == 200 ){
			console.log('body:', body);
			_next();
		}
	});
}

