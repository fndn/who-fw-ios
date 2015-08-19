var xhr = require("xhr");

var AUTHTOKEN = module.exports.AUTHTOKEN = "559a76055373e44630a51b6a";

var API = module.exports.API = "http://localhost:8080";
//var API = module.exports.API = "http://whofw.fndn.dk:8080";

var headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-Auth-Token': AUTHTOKEN
};

module.exports.get = function(uri, cb){
	console.log('Network.get()', API + uri);
	xhr({uri: API + uri, headers: headers}, function (err, resp, body) {
		//console.log('xhr resp', resp, body);
		if( resp.statusCode == 404 ){
			cb(resp, body);
		}else{
			cb(null, JSON.parse(body) );
		}
	})
}


module.exports.Request = function(method, uri, body, cb){
	console.log('Network.Request()', method, API+uri, body);

	var opts = {
		uri: API+uri,
		headers: headers,
		method:method
	};
	if( typeof body == 'function'){
		cb = body;
	}else{
		if( body != null ) opts.body = JSON.stringify(body);
	}

	console.log('Network.Request', opts );

	xhr(opts, function (err, resp, body) {
		if( resp.statusCode == 404 ){
			cb(resp, body);
		}else{
			cb(null, JSON.parse(body) );
		}
	});
}

