'use strict';

var React 			        = require('react-native');
var Datastore 		        = require('fndn-rn-datastore');
var t 				        = require('tcomb-form-native');
var CameraCapture 	        = require('./CameraCapture');
var RegisterBrand 	        = require('./RegisterBrand');
var Models 			        = require('../Models');
var GlobalStyles 	        = require('../../Styles/GlobalStyles');
var RegisterPriceAndPromo   = require('./RegisterPriceAndPromo');

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
['cartoons', 'picturesOfInfantsOrYoungChildren', 'picturesOfMothers', 'comparativeClaims', 'nutrientContentClaims', 'nutrientContentClaims', 'other'].forEach( function(el){
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
	SegmentedControlIOS,
	NavigatorIOS,
	Image,
	ScrollView
} = React;



var _tmp_state = {};
var this_exists = false;

var RegisterProduct = React.createClass({

	getInitialState: function() {
		var data = null;
		var hundredData = null;
		var servingData = null;
		var nutBoolData = {boolValue:false};
		var nutServingBoolData = {boolValue:false};
		var visualData = null;
		var nutrientContentClaimsBool = {boolValue: false};
		var nutrientContentClaims = null;
		var otherBool = {boolValue: false};
		var otherClaim = null;
		var saltSodium = null;
		var servingSaltSodiumValue = null;
		var hundredSaltSodiumValue = null;

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

			console.log('# 2 Product was cloned!');
			console.log('# 2 with: ', Datastore.M.product);

			data = Datastore.clone(Datastore.M.product);

			// remap enums
			data.foodType = Models.getKeyByValue(Models.foodTypes.meta.map, data.foodType);
			data.ageGroup = Models.getKeyByValue(Models.ageGroups.meta.map, data.ageGroup);

			data.brand = Models.numberToLetters(Datastore.data.where("brands", {country: Datastore.M.country.name, name: data.brand})[0]._id)


			hundredData = data.nutritionalPr100g;
			servingData = data.nutritionalPrServing;

			if(hundredData) {
				if (data.nutritionalPr100g.salt) {
					hundredSaltSodiumValue = {tValue: data.nutritionalPr100g.salt};
					saltSodium = "Salt";
				}
				else if (data.nutritionalPr100g.sodium) {
					hundredSaltSodiumValue = {tValue: data.nutritionalPr100g.sodium};
					saltSodium = "Sodium";
				}
			}

			if(servingData) {
				if (data.nutritionalPrServing.salt) {
					servingSaltSodiumValue = {tValue: data.nutritionalPrServing.salt};
					saltSodium = "Salt";
				}
				else if (data.nutritionalPrServing.sodium) {
					servingSaltSodiumValue = {tValue: data.nutritionalPrServing.sodium};
					saltSodium = "Sodium";
				}
			}

			if(servingData)
				nutServingBoolData = {boolValue:true};

			if(hundredData)
				nutBoolData = {boolValue:true};

			visualData = data.visualInformation;
			if(data.nutrientContentClaims) {
				nutrientContentClaimsBool = {boolValue: true};
				nutrientContentClaims = data.nutrientContentClaims;
			}
			if(data.otherClaim) {
				otherBool = {boolValue: true};
				otherClaim = data.otherClaim;
			}
			//if(data.images) images = data.images;
			//Datastore.M.product = null;
			console.log(hundredData);
		}

		_tmp_state.value = data;
		_tmp_state.nutHundredValue = hundredData;
		_tmp_state.nutServingValue = servingData;
		_tmp_state.visualInfo = visualData;
		_tmp_state.otherClaim = otherClaim;
		_tmp_state.nutrientContentClaims = nutrientContentClaims;
		_tmp_state.servingSaltSodiumValue = servingSaltSodiumValue;
		_tmp_state.hundredSaltSodiumValue = hundredSaltSodiumValue;
		_tmp_state.scrollOffset = 0;

		return {
			options: options,
			value: data,
			nutBool: nutBoolData,
			nutServingBool: nutServingBoolData,
			nutHundredValue: hundredData,
			nutServingValue: servingData,
			saltSodium: saltSodium,
			servingSaltSodiumValue: servingSaltSodiumValue,
			hundredSaltSodiumValue: hundredSaltSodiumValue,
			visualInfo: visualData,
			nutrientContentClaimsBool: nutrientContentClaimsBool,
			nutrientContentClaims: nutrientContentClaims,
			otherBool: otherBool,
			otherClaim: otherClaim,
			initialPosition: null,
			images: images,
			uuid: uuid,
		};
	},

	componentDidMount: function() {
		this_exists = true;
		navigator.geolocation.getCurrentPosition(
			(initialPosition) => {if(this_exists) this.setState({initialPosition});},
			(error) => alert(error.message),
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	},

	componentWillUnmount: function()
	{
		// This is to prevent warning when geolocation returns, if component has unmounted
		this_exists = false;
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
					ref="per100Bool"
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
				ref="perServingBool"
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



		var saltSodium = (this.state.saltSodium) ? (<Form
			ref="hundredSalt"
			type={ t.struct({ tValue: t.maybe(t.Num) }) }
			value={this.state.hundredSaltSodiumValue}
			options={{ fields:{tValue:{label:this.state.saltSodium + " (g)", keyboardType: 'numeric'}  }}}
			onChange={(value) => { _tmp_state.hundredSaltSodiumValue = value }}
			/>) : null;

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

				<SegmentedControlIOS
					ref="salt1"
					values={["Salt", "Sodium"]}
					selectedIndex={this.state.saltSodium === "Salt" ? 0 : this.state.saltSodium === "Sodium" ? 1 : null}
					style={{marginBottom:15}}
					onValueChange={(value)=>{

						this.storeTmpState();
						this.setState({saltSodium: value});

					}}
					/>

				{saltSodium}
			</View>
		)
	},

	renderNutritionalPrServing: function()
	{
		if(!this.state.nutServingBool.boolValue)
			return;

		var saltSodium = (this.state.saltSodium) ? (<Form
			ref="servingSalt"
			type={ t.struct({ tValue: t.maybe(t.Num) }) }
			value={ this.state.servingSaltSodiumValue }
			options={{ fields:{tValue:{label:this.state.saltSodium + " (g)", keyboardType: 'numeric'}  }}}
			onChange={(value) => { _tmp_state.servingSaltSodiumValue = value }}
			/>) : null;

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
				<SegmentedControlIOS
					ref="salt2"
					values={["Salt", "Sodium"]}
					selectedIndex={this.state.saltSodium === "Salt" ? 0 : this.state.saltSodium === "Sodium" ? 1 : null}
					style={{marginBottom:15}}
					onValueChange={(value)=>{

						this.storeTmpState();
						this.setState({saltSodium: value});

					}}
					/>

				{saltSodium}
			</View>
		)
	},

	renderNutrientContentClaims: function()
	{

		if(!this.state.nutrientContentClaimsBool.boolValue)
			return(
				<View>
					<Form
						type={Models.SimpelBool()}
						options={
							{fields:{boolValue:{ label:'Nutrient content claims', onTintColor:'#4B92DB'}}}
						}
						value={this.state.nutrientContentClaimsBool}
						onChange={(value) =>{this.storeTmpState();this.setState({nutrientContentClaimsBool: value})}}
						/>
				</View>
			);
		else
			return(
				<View>
					<Form
						type={Models.SimpelBool()}
						options={
							{fields:{boolValue:{ label:'Nutrient content claims', onTintColor:'#4B92DB'}}}
						}
						value={this.state.nutrientContentClaimsBool}
						onChange = {(value) =>{this.storeTmpState();this.setState({nutrientContentClaimsBool: value})}}/>

					<Form
						ref="nutrientContentClaimsForm"
						type={Models.NutrientContentClaims()}
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
						value={this.state.nutrientContentClaims}
						onChange={(value) => {_tmp_state.nutrientContentClaims = value}}/>

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
		console.log("Rendeer with offset " , _tmp_state.scrollOffset);
		return (
			<View style={GlobalStyles.scrollViewContainer}>
				<ScrollView
					style={GlobalStyles.scrollViewList}
					automaticallyAdjustContentInsets={false}
					keyboardDismissMode={'on-drag'}
					keyboardShouldPersistTaps={false}
					scrollsToTop={true}
					contentOffset={{x:0, y:_tmp_state.scrollOffset + Math.random()}}
					onScroll={(event: Object) => {_tmp_state.scrollOffset = event.nativeEvent.contentOffset.y;}}
					scrollEventThrottle={5}>

					{this.renderTop()}
					{this.renderNutritionalPr100g()}
					{this.renderMid()}
					{this.renderNutritionalPrServing()}

					{this.renderBottom()}
					{this.renderNutrientContentClaims()}
					{this.renderImages()}
				</ScrollView>
			</View>
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

	onReturnedFromCamera: function (_pics, productPos) {
		// Add the new images to the upload queue

		var pics = Datastore.clone(_pics);
		var uuid = this.state.uuid;

		/// store images in two props:
		// $images for state and display
		// $imgstore for upload
		var images = [];
		var imgstore = [];
		Object.keys( pics ).forEach( function(el){
			imgstore.push({name: el, path: pics[el]});
			// e.g.: {name:front, path:/a/b.jpg}
			images[el] = pics[el];
		});
		
		console.log("= [RegisterProduct] onReturnedFromCamera ", 'uuid', this.state.uuid, "images:", images);

		this.setState({images: images, imgstore:imgstore});
	},

	onAddBrand: function () {
		this.storeTmpState();

		this.props.navigator.push({
			leftButtonTitle: 'Cancel',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Register Brand',
			component: RegisterBrand,
			callback: this.onReturnFromAddBrand

		});
	},

	onReturnFromAddBrand(id)
	{
		console.log("Returned with", id);
		_tmp_state.brand = Models.numberToLetters(id);
		this.setState({value: _tmp_state});
	},


	storeTmpState: function () {
		//console.log("## Storing TPM state", _tmp_state);

		this.setState({
			value: _tmp_state.value,
			nutHundredValue: _tmp_state.nutHundredValue,
			nutServingValue: _tmp_state.nutServingValue,
			visualInfo: _tmp_state.visualInfo,
			nutrientContentClaims: _tmp_state.nutrientContentClaims,
			otherClaim: _tmp_state.otherClaim,
			hundredSaltSodiumValue: _tmp_state.hundredSaltSodiumValue,
			servingSaltSodiumValue: _tmp_state.servingSaltSodiumValue
		});
	},

	getProduct: function() {

		//this.storeTmpState();

		var value = this.refs.form.getValue();
		if (value) {

			var newVal = Datastore.clone(value);

			newVal.nutritionalPr100g = null;
			newVal.nutritionalPrServing = null;

			console.log("# Checkpoint 1");
			if(this.refs.form2) {
				if (this.refs.form2.getValue()) {
					newVal.nutritionalPr100g = Datastore.clone(this.refs.form2.getValue());
					console.log(newVal.nutritionalPr100g);
					var hasInfo = false;
					for(var key in newVal.nutritionalPr100g)
					{
						if(newVal.nutritionalPr100g.hasOwnProperty(key))
						{
							if(newVal.nutritionalPr100g[key]) {
								hasInfo = true;
								break;
							}
						}
					}
					if(!hasInfo)
					{
						alert("Please fill in some information under \"Nutritional information per 100 g\" or uncheck it");

						this.jumpToError(this.refs.per100Bool, "boolValue");
						return null;
					}
					//console.log("# Checkpoint 2");
					if (this.refs.hundredSalt) {
						if (this.refs.hundredSalt.getValue()) {
							//console.log("# Checkpoint 3");
							if (this.state.saltSodium == "Salt")
								newVal.nutritionalPr100g.salt = Datastore.clone(this.refs.hundredSalt.getValue()).tValue;
							else
								newVal.nutritionalPr100g.sodium = Datastore.clone(this.refs.hundredSalt.getValue()).tValue;
						}
						else {
							this.jumpToError(this.refs.hundredSalt);
							return null;
						}
					}
				}
				else {this.jumpToError(this.refs.form2); return null;}
			}
			//console.log("# Checkpoint 4");
			if(this.refs.form3) {
				if (this.refs.form3.getValue()) {
					newVal.nutritionalPrServing = Datastore.clone(this.refs.form3.getValue());
					//console.log("# Checkpoint 5");

					var hasInfo = false;
					for(var key in newVal.nutritionalPrServing)
					{
						if(newVal.nutritionalPrServing.hasOwnProperty(key))
						{
							if(newVal.nutritionalPrServing[key]) {
								hasInfo = true;
								break;
							}
						}
					}
					if(!hasInfo)
					{
						alert("Please fill in some information under \"Nutritional information per serving\" or uncheck it");

						this.jumpToError(this.refs.perServingBool, "boolValue");
						return null;
					}

					if (this.refs.servingSalt) {
						if (this.refs.servingSalt.getValue()) {
							//console.log("# Checkpoint 6");
							if (this.state.saltSodium == "Salt")
								newVal.nutritionalPrServing.salt = Datastore.clone(this.refs.servingSalt.getValue()).tValue;
							else
								newVal.nutritionalPrServing.sodium = Datastore.clone(this.refs.servingSalt.getValue()).tValue;
						}
						else {
							this.jumpToError(this.refs.servingSalt);
							return null;
						}
					}
				}
				else {this.jumpToError(this.refs.form3); return null;}
			}

			// convert foodtype, brand and agegroup
			newVal.brand = Models.letterToNumbers(newVal.brand);
			newVal.brand = Datastore.data.one("brands", {_id:newVal.brand}).name;
			newVal.foodType = Models.foodTypes.meta.map[newVal.foodType];
			newVal.ageGroup = Models.ageGroups.meta.map[newVal.ageGroup];

			//console.log("# Checkpoint 7");


			if(this.refs.nutrientContentClaimsForm){
				newVal.nutrientContentClaims = Datastore.clone(this.refs.nutrientContentClaimsForm.getValue());
			}

			//console.log("# Checkpoint 8");

			newVal.visualInformation = Datastore.clone(this.refs.form4.getValue());
			//newVal.brand = Datastore.M.brand.name;
			for(var key in this.state.images)
			{
				if(this.state.images.hasOwnProperty(key))
				{
					if(!this.state.images[key]) {
						alert("You need to take pictures of the product!");
						return null;
					}
				}
			}
			newVal.images = this.state.images; //Datastore.clone(this.state.images);
			newVal.imgstore = this.state.imgstore;
			
			newVal.country = Datastore.M.country.name;

			newVal.uuid   = this.state.uuid;
			console.log('#1 Prod UUID ', newVal.uuid);
			console.log('#1 Prod IMAGES ', newVal.images);

			return newVal;
		}
		else
		{
			this.jumpToError(this.refs.form);
			return null;
		}
	},

	jumpToError(ref, firstError = null)
	{

		if(!firstError)
			firstError = ref.validate().errors[0].path[0];

		ref.getComponent(firstError).refs.input.measure((ox,oy,width,height,px,py) =>
		{
			_tmp_state.scrollOffset += (py - 110.5);
			//console.log("GO TO: " , _tmp_state.scrollOffset);
			if(_tmp_state.scrollOffset < 0) _tmp_state.scrollOffset = 0;
			this.storeTmpState();
		});
	},

	onPress: function(){
		var newVal = this.getProduct();

		if(newVal)
		{

			console.log('-------------------------------');
			console.log("[RegisterProduct] Saving newVal:", newVal);
			// Register product
			var entry = Datastore.data.add('products', newVal);

			Datastore.M.product = newVal;
			// Begin new flow where we jump directly to price
			newVal = {};
			newVal.product = Datastore.data.one('products', {_id:entry.insert_id});
			if(newVal.product) {
				newVal.country = Datastore.M.country;
				newVal.location = Datastore.clone(Datastore.M.location);
				// Convert location to readable info


				//newVal.location.incomeType = Models.incomeTypes.meta.map[newVal.location.incomeType];
				//newVal.location.storeType = Models.storeTypes.meta.map[newVal.location.storeType];
				//newVal.location.storeBrand = Datastore.data.one('storeBrands', {_id:newVal.location.storeBrand}).name;

				newVal.credentials = Datastore.M.credentials;
				newVal.timeOfRegistration = Date.now(); // UTC in seconds

				//console.log("  this,state", this.state );

				if (this.state.hasOwnProperty('initialPosition')) {
					newVal.gpsLocation = this.state.initialPosition;
				} else {
					newVal.gpsLocation = {};
				}

				// Create a unique "name":
				newVal.name = Datastore.shortid.generate();

				// Strip local _id fields
				newVal = Datastore.data.removeIDs(newVal);
				// Registrations is sortable by location hash
				newVal.locationID = Datastore.M.location.hash;

				this.props.navigator.push({
					onLeftButtonPress: () => this.props.navigator.popToRoute(Datastore.M.SelectProductRoute),
					leftButtonTitle: 'Back',
					component: RegisterPriceAndPromo,
					title: 'Price Information',
					displayName: 'RegisterPriceAndPromo',
					passProps: {productToRegister: newVal}
				});
			}
			else {
				this.props.navigator.pop();
			}
			// End new flow


		}
	}
});



// Heights:
// text field: 78.5
// picker: 257.5

var styles = StyleSheet.create({
	addBrandButton:{
		position: 'absolute',
		top: 0,
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