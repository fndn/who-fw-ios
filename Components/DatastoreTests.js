
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
	
	//Network.get("/version", function(err, json){
	//	console.log('version:', json);
	//});

	Network.get("/versioncc", function(err, json){
		if( err ) return console.log(err);
		console.log('version:', json);
	});
}

		