
var Datastore 	= require('./Datastore');
var Network 	= require('./Network');

module.exports.RunSessionTests = function(){

	console.log("Running DatastoreTests.RunSessionTests");

	Datastore.Session.Start(1); // or the id of an existing session
	
	Datastore.Session.Set( "test2", 245);
	console.log("Get() > Should eq 245:", Datastore.Session.Get( "test2") );

	Datastore.Session.Set( "country", "da");
	Datastore.Session.Set( "obj", Datastore.Session );

	Datastore.Session.Show();

}

module.exports.RunNetworkTests = function(){
	console.log('Running DatastoreTests.RunNetworkTests');
	
	console.log('a');
	Network.Request("GET", "/version", null, function(err, json){
		console.log('a:', json);
	});
	
	console.log('b');
	Network.Request("GET", "/xx", null, function(err, json){
		console.log('b:', json);
	});

	console.log('c');
	Network.Request("PUT", "/testing", {name:"t1"}, function(err, json){
		console.log('c:', json);
	});

	console.log('d');
	Network.Request("GET", "/testing", null, function(err, json){
		console.log('d:', json);
	});
}

		