var Datastore 	= require('fndn-rn-datastore');


module.exports.extractProductImages = function(items){

	var res = [];
	
	for(var i=0; i<items.length; i++){
		var p = items[i];
		console.log(' extractProductImages > product.uuid', p.product.uuid);

		// copy the images [{name:front, path:/a/b.jpg},...]
		var files = Datastore.clone( p.product.images );

		for(var f in files){
			var f = files[f];
			if( f === null ){
				console.log('f', f);
				p.product.images = false;
			}else{
				console.log('###');
				// during dev:
				//Datastore.data.del("imageQueue", {id:p.product.uuid} );
				//console.log('DEVONLY: Removed '+ p.product.uuid +' from imageQueue');

				var path = f.path.split("/").slice(-1)[0];
				var o = {id:p.product.uuid, uploaded:8989, name:f.name, model:'products', path:path};
				Datastore.data.addu("imageQueue", o );
				p.product.images = true;
			}
		}
		
		res.push(p);

		// update the datastore
		Datastore.data.put("registrations", {name:p.name}, p);
	}

	return res;
}


module.exports.uploadImageQueue = function(table, progress_cb, complete_cb){

	var items = Datastore.data.all("imageQueue");
	console.log('2 raw items', items);
	//items = items.filter( function(el){ return !el.uploaded } ); /// ################

	_uploadImageQueue_step(table, items, items.length, progress_cb, complete_cb);
}

function _uploadImageQueue_step(table, items, itemsStartcount, progress_cb, complete_cb){

	//console.log('_uploadImageQueue_step table:', table, items.length);

	if( items.length == 0){
		complete_cb();
	}else{
		_uploadImageQueue_worker(table, items, itemsStartcount, _uploadImageQueue_step, progress_cb, complete_cb );
	}
}

function _uploadImageQueue_worker(table, itms, itemsStartcount, cb, progress_cb, complete_cb){

	var itm  = itms.shift();
	var path = itm.path.split("/").slice(-1)[0];

	var obj = {
		remote: '/'+ table +'/upload',
		id: itm.id,
		files: [{name:itm.name, path:path}]
	};
	//console.log('_uploadImageQueue_worker', obj);

	Datastore.up(obj, function(err, res){
		if( err ){
			console.log('upload ERROR', err, res);
			Datastore.data.put("imageQueue", {id:itm.id}, {uploaded:true, failed:true} );

		}else{
			console.log('upload OK', res);

			// Mark the item as uploaded (could just delete it)
			Datastore.data.put("imageQueue", {id:res.id, name:itm.name}, {uploaded:true} );
			
			//TODO: Delete the image /// ################
		}
		progress_cb( (itemsStartcount-itms.length) / itemsStartcount * 100 );
		cb(table, itms, itemsStartcount, progress_cb, complete_cb);
	});
}


module.exports.listMissingImages = function(table, sizes, tags, cb){
	// Determine wich images we need

	var url_prefix = Datastore.opts().net.remotehost + '/pub/'+ table +'/img/';

	var items = Datastore.data.all(table).slice(0,2);
	//console.log('items', items);
	console.log('items.length', items.length);

	// Compose a list of filenames
	var wish = [];
	for(var i = 0; i<items.length; i++){
		var f = items[i].uuid || items[i].id || false;
		if(f){
			var a = tags.map( function(t){ return f +'-'+ t});
			var b = [];
			for(var s in sizes){
				for(var f in a){
					b.push( a[f] +'-'+ sizes[s] +'.jpg' );
				}
			}		
			wish = wish.concat( b );
		}
		
		//console.log('items[i].images', items[i].images);
	}
	//console.log('wish', wish);

	// Compare with what we have already
	var listing = Datastore.fs.ls({dir:table}, function(err, res){
		console.log('listing', res); // 'listing', { list: [ 'NJheV3mC-left-300x300.jpg' ], directory: 'products' }

		var result = [];
		for(var i in wish){
			if( res.list.indexOf( wish[i] ) > -1 ){
				console.log('we already have ', wish[i] );
			}else{
				result.push( url_prefix + wish[i] );
			}
		}
		console.log('result', result);
		cb( result );
	});

	
}

