/*
var xhr 	= require("xhr");
var Config 	= require('./Datastore.Config');

var serverIsReachable = false;
var serverResponseTime = -1;

var _serverIsReachable = module.exports._serverIsReachable = function(){
	var addr = Config.server +"/version?noop="+ Math.random()*1000;
	//var startTime = (new Date()).getTime();
	var x = xhr({
		'method':'GET', 
		'uri': addr,
		'timeout': Config.timeout
	}, function (err, resp, body){
			//console.log("serverIsReachable response: err, resp, body:", err, resp, body );

			
			console.log('resp.statusCode', resp.statusCode );

			if( err ){
				_completion_cb("Network error", true);
				serverIsReachable = false;
			}

			if( body.status == 'ok' ){
				serverIsReachable = true;
 			}
		}
	);
}
*/