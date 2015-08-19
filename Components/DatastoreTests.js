
var Datastore = require('./Datastore');

module.exports.RunSessionTests = function(){

	console.log("DatastoreTests run()");

	Session.Create();
	
	Datastore.Session.Set( "test2", 245);
	console.log("Get() > Should eq 245:", Datastore.Session.Get( "test2") );

	Datastore.Session.Show();


}