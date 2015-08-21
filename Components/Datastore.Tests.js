
var Datastore 	= require('./Datastore');
var Config  	= require('./Datastore.Config');
var xhr 		= require("xhr");


module.exports.RunSyncTest = function(){
	console.log('Running DatastoreTests.RunSyncTest');

	DatastoreSync.Sync(
		// progress:
		function(step, steps, table){
			console.log("[Calee] SyncProgress: ", step, steps, table);
		},
		// completion
		function(msg){
			console.log("[Calee] SyncComplete: ", msg );
		}
	);
}

module.exports.RunDiffTest = function(){
	console.log('Running DatastoreTests.RunDiffTest');

	Datastore.all('countries', function(items){
		console.log('Running DatastoreTests.RunDiffTest items', items);

		xhr({
			method:'POST',
			uri: Config.server +'/countries/diff',
			json:{list:items},
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Auth-Token': Config.auth_token
			},

		},
		function (err, resp, body){
			console.log("diff response:", err, resp, body );
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

     		/*
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
			*/

		});

	});
}

module.exports.RunDatastoreTests = function(){
	console.log('Running DatastoreTests.RunDatastoreTests');

	Datastore.add("countries", {"name":"aa", "countryCode":"bb"});
	console.log('all >  ', Datastore.all("countries") );


	////console.log('add >  ', Datastore.add(table, {name:'js', age:40}) );
	////console.log('all >  ', Datastore.all(table) );
	////console.log('one 2 >', Datastore.one(table, 2) );
	//console.log('put 3 key >', Datastore.put(table, 3, 'age', 44) );
	//console.log('put 4 obj >', Datastore.put(table, 3, {'age':55}) );
	//////console.log('del 1 >', Datastore.del(table, 1) );

	//console.log('all >  ', Datastore.all(table) );

	//console.log('putx >  ', Datastore.putx(table, {name: 'js', age: 155}) );

	//console.log('all >  ', Datastore.all(table) );

}