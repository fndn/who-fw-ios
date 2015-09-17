'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var t 				= require('tcomb-form-native');
var CameraCapture 	= require('./CameraCapture');
var RegisterBrand 	= require('./RegisterBrand');
var Models 			= require('../Models');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
//var RNFS            = require('react-native-fs');

//var RNFS            = require('react-native-fs');

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
		boolValue:{ label:'Nutritional information pr 100g available', onTintColor:'#4B92DB'}
	}
};

var nutServingBoolOptions = {
    fields:{
        boolValue:{ label:'Nutritional information pr serving available', onTintColor:'#4B92DB'}
    }
};

var healtClaimsBoolOptions = {
    fields:{
        boolValue:{ label:'Health claims', onTintColor:'#4B92DB'}
    }
};

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
    TouchableOpacity,
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

var _tmp_state = {};

var RegisterProduct = React.createClass({

	getInitialState: function() {
		var data = null;
		var hundredData = null;
		var servingData = null;
		var nutBoolData = {boolValue:false};
        var nutServingBoolData = {boolValue:false};
		var visualData = null;
        var healthClaimsBool = {boolValue: false};
        var healthClaims = null;
        var otherBool = {boolValue: false};
        var otherClaim = null;

		var images = {
			front: null,
			back: null,
			right: null,
			left: null
		};

		var uuid = Datastore.shortid.generate();

		// Q: Should we make a new UUID for it? YES - and we should NOT let it inherit images from the source.
		// (reason: the images should depict the product *in detail* so it CAN NOT look *exactly* the same as its source)

		if(this.props.getProductData){
			//was cloned
			var data = Datastore.cloneObject(Datastore.MemoryStore.product);
			hundredData = data.nutritionalPr100g;
			servingData = data.nutritionalPrServing;

            if(servingData)
                nutServingBoolData = {boolValue:true};

            if(hundredData)
			    nutBoolData = {boolValue:true};

			visualData = data.visualInformation;
            if(data.healthClaims) {
                healthClaimsBool = {boolValue: true};
                healthClaims = data.healthClaims;
            }
            if(data.otherClaim) {
                otherBool = {boolValue: true};
                otherClaim = data.otherClaim;
            }
			//if(data.images) images = data.images;
            //Datastore.MemoryStore.product = null;
            console.log(hundredData);
		}

        _tmp_state.value = data;
        _tmp_state.nutHundredValue = hundredData;
        _tmp_state.nutServingValue = servingData;
        _tmp_state.visualInfo = visualData;
        _tmp_state.otherClaim = otherClaim;
        _tmp_state.healthClaims = healthClaims;

		return {
			options: options,
			value: data,
			nutBool: nutBoolData,
            nutServingBool: nutServingBoolData,
			nutHundredValue: hundredData,
			nutServingValue: servingData,
			visualInfo: visualData,
            healthClaimsBool: healthClaimsBool,
            healthClaims: healthClaims,
            otherBool: otherBool,
            otherClaim: otherClaim,
			initialPosition: null,
			images: images,
			uuid: uuid,
			imagePaths: {}
		};
	},

	componentDidMount: function() {
		navigator.geolocation.getCurrentPosition(
			(initialPosition) => this.setState({initialPosition}),
			(error) => alert(error.message),
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	},
// <editor-fold desc=" Render methods">
    renderTop: function(){
        return(
            <View>
                <Form
                    ref="form"
                    type={Models.Product()}
                    value={this.state.value}
                    options={this.state.options}
                    onChange={(value) =>{_tmp_state.value = value}}
                />

                <TouchableOpacity
                    style={styles.addBrandButton}
                    onPress = {this.onAddBrand}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>



                <Form
                    type={Models.SimpelBool()}
                    options={nutBoolOptions}
                    value={this.state.nutBool}
                    onChange={(value) =>{this.storeTmpState();this.setState({nutBool: value})}}
                    />
            </View>
        );
    },

    renderMid: function () {
        return(
            <Form
                type={Models.SimpelBool()}
                options={nutServingBoolOptions}
                value={this.state.nutServingBool}
                onChange={(value) =>{this.storeTmpState();this.setState({nutServingBool: value})}}
                />
        );
    },

    renderNutritionalPr100g: function()
    {
        if(!this.state.nutBool.boolValue)
            return;

        return(
            <View>
                <Text style={GlobalStyles.title}>
                    Pr 100g
                </Text>
                <Form
                    ref="form2"
                    type={Models.Nutrition()}
                    value={this.state.nutHundredValue}
                    onChange={(value) =>{_tmp_state.nutHundredValue = value}}
                    options={this.state.options}
                    />
            </View>
        )
    },

    renderNutritionalPrServing: function()
    {
        if(!this.state.nutServingBool.boolValue)
            return;

        return(
            <View>
                <Text style={GlobalStyles.title}>
                    Per serving
                </Text>
                <Form
                    ref="form3"
                    type={Models.NutritionServing()}
                    value={this.state.nutServingValue}
                    options={this.state.options}
                    onChange={(value) =>{_tmp_state.nutServingValue = value}}
                    />
            </View>
        )
    },

    renderHealthClaims: function()
    {

        if(!this.state.healthClaimsBool.boolValue)
            return(
                <View>
                    <Form
                        type={Models.SimpelBool()}
                        options={
                            {fields:{boolValue:{ label:'Health claims', onTintColor:'#4B92DB'}}}
                        }
                        value={this.state.healthClaimsBool}
                        onChange={(value) =>{this.storeTmpState();this.setState({healthClaimsBool: value})}}
                        />
                </View>
            );
        else
            return(
                <View>
                    <Form
                        type={Models.SimpelBool()}
                        options={
                            {fields:{boolValue:{ label:'Health claims', onTintColor:'#4B92DB'}}}
                        }
                        value={this.state.healthClaimsBool}
                        onChange = {(value) =>{this.storeTmpState();this.setState({healthClaimsBool: value})}}
                    />

                    <Form
                        ref="healthClaimsForm"
                        type={Models.HealthClaims()}
                        options={
                            {
                            fields:{
                                noSalt:{label: 'Unsaltet/No salt/No added salt', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noSugar:{label: 'No added sugar/low in sugar', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noSweeteners:{label: 'No artificial sweetners', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                vitamins:{label: 'Fortified with vitamins/minerals', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noPreservatives:{label: 'No artificial preservatives', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noStarch:{label: 'No added starch', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noColors:{label: 'No artificial colors', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                noFlavours:{label: 'No artificial flavors', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                glutenFree:{label: 'Gluten free', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                organic:{label: 'Organic', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB'},
                                other:{template: GlobalStyles.indentedTextbox}
                                }
                            }
                        }
                        value={this.state.healthClaims}
                        onChange={(value) => {_tmp_state.healthClaims = value}}
                        />

                </View>
            );

    },


    renderBottom: function()
    {
        return(
            <View>
                <Text style={GlobalStyles.title}>
                    Visual information
                </Text>
                <Form
                    ref="form4"
                    type={Models.VisualInformation()}
                    options={options}
                    value={this.state.visualInfo}
                    onChange={(value) =>{_tmp_state.visualInfo = value}}
                    />
            </View>
        )
    },

    renderImages: function() {
      return(
          <View>
                <Text style={GlobalStyles.title}>
                    Pictures
                </Text>
                <TouchableHighlight style={GlobalStyles.button} onPress={() =>{this.onOpenCamera("front");}} underlayColor='#99d9f4'>
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
            </View>
        )
    },


	render: function(){

        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                {this.renderTop()}
                {this.renderNutritionalPr100g()}
                {this.renderMid()}
                {this.renderNutritionalPrServing()}



                {this.renderBottom()}
                {this.renderHealthClaims()}
                {this.renderImages()}
            </ScrollView>
        );

	},


	onOpenCamera: function(position){
        this.storeTmpState();

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

		var imageUris = Datastore.clone(_imageUris);

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
		var paths = Datastore.clone(_paths);
		
		console.log("= [RegisterProduct] onReturnedFromCamera ", 'uuid', this.state.uuid, "paths:", paths);

		// Add the new images to the upload queue
		Datastore.data.add("imageQueue", {name:this.state.uuid, paths:paths} );

		this.setState({images: imageUris, imagePaths:paths});
	},

	onAddBrand: function () {
        this.storeTmpState();

		this.props.navigator.push({
			leftButtonTitle: 'Cancel',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Register Brand',
			component: RegisterBrand

		});
	},

    storeTmpState: function () {
        this.setState({
            value: _tmp_state.value,
            nutHundredValue: _tmp_state.nutHundredValue,
            visualInfo: _tmp_state.visualInfo,
            healthClaims: _tmp_state.healthClaims,
            otherClaim: _tmp_state.otherClaim
        });
    },

    getProduct: function()
    {
        // call getValue() to get the values of the form

		// images are always linked to the product,
		// and named on disk as "Unique Product ID" (shortid())
		// pluss image_type (front, back, etc.)
        this.storeTmpState();
        //console.log("Hello")
		var value = this.refs.form.getValue();
		if (value) { // if validation fails, value will be null



			// Copy value because it is not extensible, then add "private" values
			var newVal = Datastore.clone(value);
			newVal.nutritionalPr100g = null;
			newVal.nutritionalPrServing = null;

            if (this.refs.form2) {
                newVal.nutritionalPr100g = Datastore.clone(this.refs.form2.getValue());
            }
            if (this.refs.form3) {
                newVal.nutritionalPrServing = Datastore.clone(this.refs.form3.getValue());
            }

            if(this.refs.healthClaimsForm)
            {
                newVal.healthClaims = Datastore.clone(this.refs.healthClaimsForm.getValue());
            }

			newVal.visualInformation = Datastore.clone(this.refs.form4.getValue());
			//newVal.brand = Datastore.M.brand.name;


			newVal.images = Datastore.clone(this.state.images);
			newVal.imagePaths = Datastore.clone(this.state.imagePaths);
			newVal.country = Datastore.M.country.name;


			/*
			 newVal.uuid   = Datastore.shortid.generate();
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
			return newVal;
		}
		else return null;
	},

	onPress: function()
	{
		var newVal = this.getProduct();

		if(newVal)
		{

			console.log('-------------------------------');
			console.log("[RegisterProduct] Saving newVal:", newVal);

			var entry = Datastore.data.add('products', newVal);
			
			if(this.props.getProductData){
				Datastore.M.product = newVal;
			}

			this.props.navigator.pop();

		}
	}
});



// Heights:
// text field: 78.5
// picker: 257.5

var styles = StyleSheet.create({
	addBrandButton:{
		position: 'absolute',
		top: 78.5,
		right: 0

	},
	addFoodTypeButton:{
		position: 'absolute',
		top: 78.5 + 257.5,
		right: 0

	},

	buttonText:
	{
		fontSize: 17,
		color: '#4b92db'
	}
});


module.exports = RegisterProduct;