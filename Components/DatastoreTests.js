
var Datastore 	= require('./Datastore');
var Network 	= require('./Network');
var xhr 		= require("xhr");

module.exports.RunSessionTests = function(){

	console.log("Running DatastoreTests.RunSessionTests");

	Datastore.Session.Start(1); // or the id of an existing session
	
	Datastore.Session.Set( "test2", 245);
	console.log("Get() > Should eq 245:", Datastore.Session.Get( "test2") );

	Datastore.Session.Set( "country", "da");

	var nested = {
		status: 'ok', 
		msg: { 
			table: 'countries',
			add: [ { countryCode: 'RU', name: 'Russia' } ],
			put: [ { countryCode: 'SE', name: 'Sweden', _id: 2 },
				   { countryCode: 'FI', name: 'Finland', _id: 4 } ],
			del: [ { name: 'Denmark', countryCode: 'dk', _id: 1 } ] } };
	
	//Datastore.Session.Set( "nested",  nested);
	//console.log("Get() nested:", Datastore.Session.Get( "nested") );

	Datastore.Session.Set("x", {});
	var tmp = Datastore.Session.Get("x").status = "test";
	Datastore.Session.Set("x", tmp);


	Datastore.Session.Set("x", (tmp.title="ja") );
	
	//console.log("Get() nested:", Datastore.Session.Get( "nested") );

	Datastore.Session.Show();
}

module.exports.RunSimpleSessionTests = function(){

	console.log("Running DatastoreTests.RunSimpleSessionTests");
	/*
	s.name = "js";
	s.children = [{"name":"Fria"},{"name":"Magnus"}];
	s.children.push( {"name":"Lui"} );
	s.children[0].age = 14;
	Datastore.PersistMemoryStore();
	*/
	Datastore.M = {"country":"Denmark"};
	Datastore.M.title = "js";
	Datastore.M.children = [{"name":"Fria"},{"name":"Magnus"}];
	Datastore.M.children.push( {"name":"Lui"} );
	Datastore.M.children[0].age = 14;
	console.log("Datastore.M", Datastore.M);

	var id = Datastore.addraw("reg-test", Datastore.M );
	console.log("id", id );

}
module.exports._RunSimpleSessionTests = function(){
	var s = Datastore.CreateMemoryStore(99);
}

module.exports.RunDiffTest = function(){
	console.log('Running DatastoreTests.RunDiffTest');

	Datastore.all('countries', function(items){
		console.log('Running DatastoreTests.RunDiffTest items', items);

		xhr({
			method:'POST',
			uri:Network.API+'/countries/diff',
			//body:JSON.stringify({list:items})
			json:{list:items}
		},
		function (err, resp, body){
			console.log("diff response:", body );
			// This should be generic, for all lists.
			// The server should reply with "update-instructions",
			// we can use to update the local data
			/*

			// Sample response:

			{ status: 'ok',
			  msg: 
			   { table: 'countries',
			     add: [ { countryCode: 'RU', name: 'Russia' } ],
			     put: 
			      [ { countryCode: 'SE', name: 'Sweden', _id: 2 },
			        { countryCode: 'FI', name: 'Finland', _id: 4 } ],
			     del: [ { name: 'Denmark', countryCode: 'dk', _id: 1 } ] } }

     		*/
     		if( body.status == 'ok' ){
     			var cmd = body.msg;
     			var table = cmd.table;
     			for(c in cmd.add ){
     				console.log("Creating", cmd.add[c] );
     				Datastore.add(table, cmd.add[c] );
     			}
     			for( c in cmd.put ){
     				console.log("Updating", cmd.put[c]._id, cmd.put[c] );
     				Datastore.put(table, cmd.put[c]._id, cmd.put[c]);
     			}
     			for( c in cmd.del ){
     				console.log("Deleting", cmd.del[c]._id, cmd.del[c] );
     				Datastore.del(table, cmd.del[c]._id);
     			}

     			console.log(" Diffing completed for table ", table );
     			console.log( Datastore.all('countries') );
     		}


		});

	});
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

		