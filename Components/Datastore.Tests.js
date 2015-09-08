
var Datastore 	= require('./Datastore');
var xhr 		= require("xhr");

module.exports.RunNetworkReachabilityTest = function(){
	console.log('');
	console.log('RunNetworkReachabilityTest');
	Datastore.Remote.OnReachableStateChanged( function(state){
		console.log('[Datastore.Tests] OnReachableStateChanged()');
		console.log('[Datastore.Tests] Datastore.Remote.Reachable: '+ Datastore.Remote.Reachable() );
		console.log('[Datastore.Tests] Datastore.Remote.ResponseTime: '+ Datastore.Remote.ResponseTime() );

	});

	console.log('[Datastore.Tests] Remote.Reachable: '+ Datastore.Remote.Reachable() );
}



module.exports.RunDiffTest = function(){
	console.log('Running DatastoreTests.RunDiffTest');

	Datastore.all('countries', function(items){
		console.log('Running DatastoreTests.RunDiffTest items', items);

		xhr({
			method:'POST',
			uri: Datastore.Config.server +'/countries/diff',
			json:{list:items},
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Auth-Token': Datastore.Config.auth_token
			},

		},
		function (err, resp, body){
			//console.log("diff response:", err, resp, body );
			console.log("diff response:", body.msg );
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


module.exports.RunSyncTest = function(){
	console.log('Running DatastoreTests.RunSyncTest');

	Datastore.Sync(
		// progress:
		function(step, steps, table){
			console.log("[Calee] SyncProgress: ", step, steps, table);
		},
		// completion
		function(msg){
			console.log("[Calee] SyncComplete: ", msg );
		},
		// mode:
		"sync"
	);
}


module.exports.RunUploadTest = function(){
	console.log('Running DatastoreTests.RunUploadTest');
	/*var table = "test-uploads";

	var prog_cb = function(msg, i, t){
		console.log('PROG_CB', msg, i, t);
	}
	var comp_cb = function(msg, i, t){
		console.log('COMP_CB', msg, i, t);
	}

	RunUploadTest_createSampleData();

	Uploader.upload(table, prog_cb, comp_cb);
	*/

	Datastore.Sync(
		// progress:
		function(step, steps, table){
			console.log("[Calee] UploadProgress: ", step, steps, table);
		},
		// completion
		function(msg){
			console.log("[Calee] Uploadcomplete: ", msg );
		},
		// mode:
		"upload"
	);
}

/*
function RunUploadTest_createSampleData(table){
	var skel = {"name":"", front:"", back:"", side1:"", side2:""};

	for(var i=0; i<3; i++){
		var o = Datastore.cloneObject(skel);
		o.name = "tn_"+ Date.now();
		o.front = "upload_test_image.jpeg";

		Datastore.put(table, o);
		console.log('RunUploadTest_createSampleData @ i:', i);
	}

}
*/


