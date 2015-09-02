/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var Datastore       = require('../Datastore');
var Models          = require('../Models');
var t               = require('tcomb-form-native');
var CameraCapture   = require('./CameraCapture');

var RNFS            = require('react-native-fs');

var Form = t.form.Form;


var options = {
	fields:{
		energyKj:{
			label: 'Energy (KJ)',
			keyboardType: 'numeric'
		},
		energyKcal:{
			label: 'Energy (kcal)',
			keyboardType: 'numeric'
		},
		fat:{
			label: 'Fat (g)',
			keyboardType: 'numeric'
		},
		fatOfWhichSaturates:{
			label: 'Fat of which saturates (g)',
			keyboardType: 'numeric'
		},
		fatOfWhichTrans:{
			label: 'Fat of which trans (g)',
			keyboardType: 'numeric'
		},
		carbohydrate:{
			label: 'Carbohydrate (g)',
			keyboardType: 'numeric'
		},
		carbohydrateOfWhichSugars:{
			label: 'Carbohydrate of which sugars (g)',
			keyboardType: 'numeric'
		},
		carbohydrateOfWhichLactose:{
			label: 'Carbohydrate of which lactose (g)',
			keyboardType: 'numeric'
		},
		protein:{
			label: 'Protein (g)',
			keyboardType: 'numeric'
		},
		salt:{
			label: 'Salt (g)',
			keyboardType: 'numeric'
		},
		sodium:{
			label: 'Sodium (g)',
			keyboardType: 'numeric'
		},
		servingSize:{
			label: 'Serving size (g)',
			keyboardType: 'numeric'
		},
		cartoons: {},
		picturesOfInfantsOrYoungChildren: {},
		picturesOfMothers: {},
		comparativeClaims: {},
		nutrientContentClaims: {},
		healthClaims: {},
		other: {}
	}
}; // optional rendering options (see documentation)

// theme "checkboxes":
['cartoons', 'picturesOfInfantsOrYoungChildren', 'picturesOfMothers', 'comparativeClaims', 'nutrientContentClaims', 'healthClaims', 'other'].forEach( function(el){
	options.fields[el]['onTintColor'] = '#4B92DB';
});


var nutBoolOptions = {
	fields:{
		boolValue:{ label:'Nutritional information available', onTintColor:'#4B92DB'}
	}
};

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	NavigatorIOS,
	Image,
	ScrollView
} = React;


function saveImage( obj ){
	// create a path you want to write to
	//var path = RNFS.DocumentDirectoryPath + obj.name;

	console.log('saveImage', obj);
	/*
	
	NIX: Could not read file at path assets-library://asset/asset.JPG?id=6A2A3518-3FC9-4C62-A35F-767CE40460BD&ext=JPG

	RNFS.readFile( obj.path ).then((b64) => {
		console.log('FILE READ b64', b64);
	}).catch((err) => {
		console.log('FILE READ ERROR:', err.message);
	});
	*/

	/*
	RNFS.writeFile(RNFS.DocumentDirectoryPath + obj.name, obj.path).then((success) => {
		console.log('FILE WRITTEN!', path);
	}).catch((err) => {
		console.log('FILE ERROR:', err.message);
	});
	*/
}

var RegisterProduct = React.createClass({

	getInitialState: function() {
		var data = null;
		var hundredData = null;
		var servingData = null;
		var nutBoolData = {boolValue:false};
		var visualData = null;

		var images = {
			front: null,
			back: null,
			right: null,
			left: null
		};

		var uuid = Datastore.ShortID.generate();

		// Q: Should we make a new UUID for it? YES - and we should NOT let it inherit images from the source.
		// (reason: the images should depict the product *in detail* so it CAN NOT look *exactly* the same as its source)

		if(this.props.getProductData){
			//was cloned
			var data = Datastore.cloneObject(Datastore.MemoryStore.product);
			hundredData = data.nutritionalPr100g;
			servingData = data.nutritionalPrServing;
			nutBoolData = {boolValue:true};
			visualData = data.visualInformation;
			//if(data.images) images = data.images;


		}

		return {
			options: options,
			value: data,
			nutBool: nutBoolData,
			nutHundredValue: hundredData,
			nutServingValue: servingData,
			visualInfo: visualData,
			initialPosition: null,
			images: images,
			uuid: uuid,
			imagepaths: {}
		};
	},

	componentDidMount: function() {
		navigator.geolocation.getCurrentPosition(
			(initialPosition) => this.setState({initialPosition}),
			(error) => alert(error.message),
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	},

	render: function(){

		if(this.state.nutBool.boolValue)
		{
			return (
				<ScrollView style={GlobalStyles.scrollViewList}>
					<Form
						ref="form"
						type={Models.Product()}
						value={this.state.value}
						options={this.state.options}
						onChange={this.onChange}
					/>
					<Form
						type={Models.SimpelBool()}
						options={nutBoolOptions}
						value={this.state.nutBool}
						onChange={this.onNutritionInfoAvailableChange}
						/>
					<Text style={GlobalStyles.title}>
						Nutritional Information
						Pr 100g
					</Text>
					<Form
						ref="form2"
						type={Models.Nutrition()}
						value={this.state.nutHundredValue}
						onChange={this.onChange2}
						options={this.state.options}
					/>
					<Text style={GlobalStyles.title}>
						Per serving
					</Text>
					<Form
						ref="form3"
						type={Models.NutritionServing()}
						value={this.state.nutServingValue}
						options={this.state.options}
						onChange={this.onChange3}
						/>
					<Text style={GlobalStyles.title}>
						Visual information
					</Text>
					<Form
						ref="form4"
						type={Models.VisualInformation()}
						options={options}
						onChange={this.onChange4}
						value={this.state.visualInfo}
						/>

					<Text style={GlobalStyles.title}>
						Pictures
					</Text>
					<TouchableHighlight style={GlobalStyles.button} onPress={this.onTakeFront} underlayColor='#99d9f4'>
						<Text style={GlobalStyles.buttonText}>Capture product images</Text>
					</TouchableHighlight>


					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.front }} />
						<Text style={GlobalStyles.imageText}>Front</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.back }} />
						<Text style={GlobalStyles.imageText}>Back</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.left }} />
						<Text style={GlobalStyles.imageText}>Left</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.right }} />
						<Text style={GlobalStyles.imageText}>Right</Text>
					</View>

					<TouchableHighlight style={GlobalStyles.button} onPress={this.onPress} underlayColor='#99d9f4'>
						<Text style={GlobalStyles.buttonText}>Save</Text>
					</TouchableHighlight>

				</ScrollView>
			);
		}
		else {
			return (
				<ScrollView style={GlobalStyles.scrollViewList}>
					<Form
						ref="form"
						type={Models.Product()}
						options={options}
						value={this.state.value}
						onChange={this.onChange}/>
					<Form
						type={Models.SimpelBool()}
						options={nutBoolOptions}
						value={this.state.nutBool}
						onChange={this.onNutritionInfoAvailableChange}/>
					<Text style={GlobalStyles.title}>
						Visual information
					</Text>
					<Form
						ref="form4"
						type={Models.VisualInformation()}
						options={options}
						onChange={this.onChange4}
						value={this.state.visualInfo}/>

					<Text style={GlobalStyles.title}>
						Pictures
					</Text>

					<TouchableHighlight style={GlobalStyles.button} onPress = {this.onTakeFront} underlayColor='#99d9f4'>
						<Text style={GlobalStyles.buttonText}>Capture product images</Text>
					</TouchableHighlight>


					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.front }} />
						<Text style={GlobalStyles.imageText}>Front</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.back }} />
						<Text style={GlobalStyles.imageText}>Back</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.left }} />
						<Text style={GlobalStyles.imageText}>Left</Text>
					</View>
					<View style={GlobalStyles.imageGrid}>
						<Image style={GlobalStyles.image} source={{ uri: this.state.images.right }} />
						<Text style={GlobalStyles.imageText}>Right</Text>
					</View>

					<TouchableHighlight style={GlobalStyles.button} onPress={this.onPress} underlayColor='#99d9f4'>
						<Text style={GlobalStyles.buttonText}>Save</Text>
					</TouchableHighlight>
				</ScrollView>
			);
		}
	},

	onTakeFront: function () {
		this.onOpenCamera("front");
	},
	onTakeBack: function () {
		this.onOpenCamera2("back");
	},
	onTakeRight: function () {
		this.onOpenCamera("right");
	},
	onTakeLeft: function () {
		this.onOpenCamera("left");
	},

	onOpenCamera: function(position){
		this.props.navigator.push({
			leftButtonTitle: 'Cancel',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Capture Picture',
			component: CameraCapture,
			passProps: {
				location: this.state.initialPosition,
				camCallback: this.onReturnedFromCamera,
				productPosition: position
			}

		});
	},

	onReturnedFromCamera: function (_imageUris, productPos) {
		// Add the new images to the upload queue

		var imageUris = Datastore.cloneObject(_imageUris);

		var uuid = this.state.uuid;
		var _paths = {};
		Object.keys( imageUris ).forEach( function(el){
			_paths[el] = {
				path: imageUris[el],
				name: uuid +'_'+ el +'.jpg',
			};

			// Save files to Documents directory
			saveImage( _paths[el] );
		});
		var paths = Datastore.cloneObject(_paths);
		
		console.log("= [RegisterProduct] onReturnedFromCamera ", 'uuid', this.state.uuid, "paths:", paths);

		// Add the new images to the upload queue
		Datastore.add("imageQueue", {name:this.state.uuid, paths:paths} );

		this.setState({images: imageUris, imagepaths:paths});
	},



	onChange: function(value)
	{
		//console.log(value);
		this.setState({value: value});
	},

	onNutritionInfoAvailableChange: function(value)
	{
		this.setState({nutBool: value})
	},

	onChange2: function(value)
	{
		this.setState({nutHundredValue: value});
	},

	onChange3: function(value)
	{
		this.setState({nutServingValue: value});
	},

	onChange4: function(value){
		this.setState({visualInfo: value});
	},


	onPress: function()
	{

		// call getValue() to get the values of the form

		// images are always linked to the product,
		// and named on disk as "Unique Product ID" (shortid())
		// pluss image_type (front, back, etc.)


		var value = this.refs.form.getValue();
		if (value) { // if validation fails, value will be null
			// Copy value because it is not extensible, then add "private" values
			var newVal = Datastore.cloneObject(value);
			newVal.nutritionalPr100g = null;
			newVal.nutritionalPrServing = null;

			if(this.refs.form2)
			{
				newVal.nutritionalPr100g = Datastore.cloneObject(this.refs.form2.getValue());
			}
			if (this.refs.form3) {
				newVal.nutritionalPrServing = Datastore.cloneObject(this.refs.form3.getValue());
			}

			newVal.visualInformation = Datastore.cloneObject(this.refs.form4.getValue());
			newVal.brand = Datastore.MemoryStore.brand.name;


			newVal.images = Datastore.cloneObject(this.state.images);
			newVal.imagepaths = Datastore.cloneObject(this.state.imagepaths);
				

			/*
			newVal.uuid   = Datastore.ShortID.generate();
			newVal._images = {};
			Object.keys( newVal.images ).forEach( function(el){
				if( newVal.images[el] != null ){
					newVal._images[el] = {
						path: newVal.images[el],
						name: newVal.uuid +'_'+ el +'.jpg',
					};
				}else{
					newVal._images[el] = null;
				}
			});
			*/


			console.log('-------------------------------');
			console.log("[RegisterProduct] Saving newVal:", newVal);
			var entry = Datastore.add('products', newVal);
			//Datastore.Set("name", value.name);
			//Datastore.add('locations', value);
			if(this.props.getProductData){
				Datastore.MemoryStore.product = newVal;
			}

			this.props.navigator.pop();

		}
	}
});



var styles = StyleSheet.create({

});



module.exports = RegisterProduct;