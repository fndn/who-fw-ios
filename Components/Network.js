
var AUTHTOKEN = module.exports.AUTHTOKEN = "559a76055373e44630a51b6a";

var API = module.exports.API = "http://localhost:8080";
//var API = module.exports.API = "http://whofw.fndn.dk:8080";

module.exports.get = function(uri, cb){
	console.log('Network.get()', API + uri);
	new fetch(API + uri, {
		method: 'get',
		/*headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': AUTHTOKEN
		}
		*/
	})
	.then((response) => response.json())
	.then((responseData) => _response(responseData, cb))
	.catch( error => cb( (error.message ? error.message : error), null ))
	.done();
}

function _response(json, cb){
	console.log('Network onComplete()', json.status, json);
	if( json.status == 'ok' ){
		cb(null, json);
	}else if( responseData.status == 'error' ){
		cb(json, null );
	}else{
		console.log('Network onComplete() unknown response status', json);
		cb( null, json );
	}
}
