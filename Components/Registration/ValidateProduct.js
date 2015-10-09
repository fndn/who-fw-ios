/**
 * Created by JacobMac on 20/08/15.
 */


'use strict';

var React 					= require('react-native');
var GlobalStyles 			= require('../../Styles/GlobalStyles');
var Datastore 				= require('fndn-rn-datastore');
var Models          		= require('../Models');
var t               		= require('tcomb-form-native');
var RegisterProduct 		= require('./RegisterProduct');

var RegisterPriceAndPromo   = require('./RegisterPriceAndPromo');

var Form = t.form.Form;


var options = {
	fields:{
		name:{
			editable: false
		},
		brand:{
			editable: false
		},
		foodType:{
			editable: false
		},
		ageGroup:{
			editable: false
		},
		energyKj:{
			editable: false,
			label: 'Energy (KJ)'
		},
		energyKcal:{
			editable: false,
			label: 'Energy (kcal)'
		},
		fat:{
			editable: false,
			label: 'Fat (g)'
		},
		fatOfWhichSaturates:{
			editable: false,
			label: 'Fat of which saturates (g)'
		},
		fatOfWhichTrans:{
			editable: false,
			label: 'Fat of which trans (g)'
		},
		carbohydrate:{
			editable: false,
			label: 'Carbohydrate (g)'
		},
		carbohydrateOfWhichSugars:{
			editable: false,
			label: 'Carbohydrate of which sugars (g)'
		},
		carbohydrateOfWhichLactose:{
			editable: false,
			label: 'Carbohydrate of which lactose (g)'
		},
		protein:{
			editable: false,
			label: 'Protein (g)'
		},
		salt:{
			editable: false,
			label: 'Salt (g)'
		},
		sodium:{
			editable: false,
			label: 'Sodium (g)'
		},
		servingSize:{
			editable: false,
			label: 'Serving size (g)'
		},
		cartoons: {disabled: true, onTintColor:'#4B92DB'},
		picturesOfInfantsOrYoungChildren: {disabled : true},
		picturesOfMothers: {disabled: true},
		comparativeClaims: {disabled: true},
		nutrientContentClaims: {disabled: true},
		healthClaims: {disabled: true},
		noSalt:{label: 'Unsaltet/No salt/No added salt', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noSugar:{label: 'No added sugar/low in sugar', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noSweeteners:{label: 'No artificial sweetners', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		vitamins:{label: 'Fortified with vitamins/minerals', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noPreservatives:{label: 'No artificial preservatives', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noStarch:{label: 'No added starch', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noColors:{label: 'No artificial colors', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		noFlavours:{label: 'No artificial flavors', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		glutenFree:{label: 'Gluten free', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		organic:{label: 'Organic', template:GlobalStyles.indentedBool, onTintColor: '#4B92DB', disabled: true},
		other: {template: GlobalStyles.indentedTextbox, editable: false}
	}
}; // optional rendering options (see documentation)

// theme "checkboxes":
['cartoons', 'picturesOfInfantsOrYoungChildren', 'picturesOfMothers', 'comparativeClaims', 'healthClaims', 'nutrientContentClaims', 'other'].forEach( function(el){
	options.fields[el]['onTintColor'] = '#4B92DB';
});


var nutBoolOptions = {
	fields:{
		boolValue:{ label:'Nutritional information available', onTintColor:'#4B92DB'}
	}
};

var validateBoolOptions =
{
	fields:{
		boolValue:{ label:'I confirm that info is correct', onTintColor:'#4B92DB'}
	}
};



var buttonStyle;
var buttonPressColor;

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	NavigatorIOS,
	ScrollView,
	AlertIOS,
	Image
	} = React;

var navigatorEventListener;
var this_exists = false;

var ValidateProduct = React.createClass({

	getInitialState: function() {
		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) =>
		{
			if(event.data.route.displayName === "ValidateProduct") {
				//console.log("ValidateProduct DATA: " , this.fillData());
				this.setState(this.fillData());
			}
			//console.log(event.data.route.component.displayName);

		});

		return this.fillData();
	},

	fillData: function()
	{
		var data = Datastore.clone(Datastore.M.product);
		//Models.storeTypes.meta.map["SUP"]
		console.log("getInitialState, ", data);
		//data.foodType = Models.foodTypes.meta.map[data.foodType];
		//data.ageGroup = Models.ageGroups.meta.map[data.ageGroup];
		//data.brand = Datastore.data.one('brands', {_id:data.brand}).name;

		var saltSodium = null;
		if(data.nutritionalPr100g) {
			if (data.nutritionalPr100g.salt)
				saltSodium = "Salt";
			else if (data.nutritionalPr100g.sodium)
				saltSodium = "Sodium";
		}
		if(data.nutritionalPrServing) {
			if (data.nutritionalPrServing.salt)
				saltSodium = "Salt";
			else if (data.nutritionalPrServing.sodium)
				saltSodium = "Sodium";
		}


		if(!data.images)
		{
			data.images = {
				front: null,
				back: null,
				right: null,
				left: null
			};
		}

		//console.log(Models.ageGroups.meta.map["FOUR"]);
		return {
			options: options,
			value: data,
			initialPosition: null,
			saltSodium: saltSodium
		};
	},

	componentDidMount: function() {
        this_exists = true;
		navigator.geolocation.getCurrentPosition(
			(initialPosition) => {if(this_exists) this.setState({initialPosition});},
			(error) => { this._noGPS(error)},
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	},

    componentWillUnmount: function()
    {
        // This is to prevent warning when geolocation returns, if component has unmounted
        this_exists = false;
        navigatorEventListener.remove();
    },

	_noGPS: function(err){
        if(this) {
            alert(err.message);
            //this.setState({'initialPosition':{'coords':{}} });
            this.setState({'initialPosition': {}});
        }
	},

	renderNutritionalPr100g: function()
	{
		if(!this.state.value.nutritionalPr100g)
			return(
				<View>
					<Text style={GlobalStyles.title}>
						No Nutritional information pr 100g
					</Text>
				</View>
			);

		var val = this.state.saltSodium == "Salt" ? this.state.value.nutritionalPr100g.salt : this.state.value.nutritionalPr100g.sodium;

		var saltSodium = (this.state.saltSodium) ? (<Form
			ref="hundredSalt"
			type={ t.struct({ tField: t.maybe(t.Num) }) }
			value={{tField:val}}
			options={{ fields:{tField:{label:this.state.saltSodium + " (g)", editable: false}  }}}
			/>) : null;

		return(
			<View>
				<Text style={GlobalStyles.title}>
					Nutritional information pr 100g
				</Text>
				<Form
					type={Models.Nutrition()}
					value={this.state.value.nutritionalPr100g}
					options={this.state.options}
					/>
				{saltSodium}
			</View>
		)
	},

	renderNutritionalPrServing: function()
	{
		if(!this.state.value.nutritionalPrServing)
			return(
				<View>
					<Text style={GlobalStyles.title}>
						No Nutritional information pr serving
					</Text>
				</View>
			);

		var val = this.state.saltSodium == "Salt" ? this.state.value.nutritionalPrServing.salt : this.state.value.nutritionalPrServing.sodium;


		var saltSodium = (this.state.saltSodium) ? (<Form
			ref="hundredSalt"
			type={ t.struct({ tField: t.maybe(t.Num) }) }
			value={{tField: val}}
			options={{ fields:{tField:{label:this.state.saltSodium + " (g)", editable: false}  }}}
			/>) : null;

		return(
			<View>
				<Text style={GlobalStyles.title}>
					Nutritional information pr serving
				</Text>
				<Form
					type={Models.NutritionServing()}
					value={this.state.value.nutritionalPrServing}
					options={this.state.options}
					/>
				{saltSodium}
			</View>
		)
	},

	renderNutrientContentClaims: function()
	{

		if(!this.state.value.nutrientContentClaims)
			return(
				<View>
					<Form
						type={Models.SimpelBool()}
						options={
							{fields:{boolValue:{ label:'Nutrient content claims', onTintColor:'#4B92DB', disabled: true}}}
						}
						value={{boolValue:false}}
						/>
				</View>
			);
		else
			return(
				<View>
					<Form
						type={Models.SimpelBool()}
						options={
							{fields:{boolValue:{ label:'Nutrient content claims', onTintColor:'#4B92DB', disabled: true}}}
						}
						value={{boolValue:true}}
						/>

					<Form
						ref="healthClaims"
						type={Models.NutrientContentClaims()}
						options={this.state.options
						}
						value={this.state.value.nutrientContentClaims}
						/>

				</View>
			);

	},

    renderConfirm: function(){
        if(this.props.onlyClone)
        {
            return (
                <View>
                    <Text style={styles.text}>
                        This product is already registered, so you can only use if for clone and edit
                    </Text>
                    <TouchableHighlight style={[styles.buttonConfirm, {opacity:0.5}]} underlayColor='#A0F584'>
                        <Text style={GlobalStyles.buttonText}>CONFIRM</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        else
        {
            return(
                <View>
                    <Text style={styles.text}>
                        Click CONFIRM to confirm that this product matches the one in the store to every detail.
                    </Text>
                    <TouchableHighlight style={styles.buttonConfirm} onPress = {this.onPress} underlayColor='#A0F584'>
                        <Text style={GlobalStyles.buttonText}>CONFIRM</Text>
                    </TouchableHighlight>
                </View>
            );
        }
    },


	render: function(){

		//console.log('value', this.state.value);


		return (

			<View style={GlobalStyles.scrollViewContainer}>
			
			<View style={GlobalStyles.info_view_wrap}>
				<Text style={GlobalStyles.info_view_text}>Make sure the product you have found matches the below exactly:</Text>
			</View>

			<ScrollView
				style={GlobalStyles.scrollViewList}
				automaticallyAdjustContentInsets={false}>

				<Form
					ref="form"
					type={Models.ProductEvaluation()}
					options={this.state.options}
					value={this.state.value}
					/>
				{this.renderNutritionalPr100g()}
				{this.renderNutritionalPrServing()}
				<Form
					ref="form4"
					type={Models.VisualInformation()}                    
					options={options}
					value={this.state.value.visualInformation}
					/>
				{this.renderNutrientContentClaims()}
				<Text style={GlobalStyles.title}>
					Pictures
				</Text>

				<View style={GlobalStyles.imageGrid}>
					{/* <Image style={GlobalStyles.image} source={{ uri: this.state.value.images.front }} /> */}
					<Image style={GlobalStyles.image} source={{ uri: Datastore.ws.img("products", this.state.value.uuid, 'front', '300x300') }} />
					<Text style={GlobalStyles.imageText}>Front</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					{/* <Image style={GlobalStyles.image} source={{ uri: this.state.value.images.back }} /> */}
					<Image style={GlobalStyles.image} source={{ uri: Datastore.ws.img("products", this.state.value.uuid, 'back', '300x300') }} />
					<Text style={GlobalStyles.imageText}>Back</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					{/* <Image style={GlobalStyles.image} source={{ uri: this.state.value.images.left }} /> */}
					<Image style={GlobalStyles.image} source={{ uri: Datastore.ws.img("products", this.state.value.uuid, 'left', '300x300') }} />
					<Text style={GlobalStyles.imageText}>Left</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					{/* <Image style={GlobalStyles.image} source={{ uri: this.state.value.images.right }} /> */}
					<Image style={GlobalStyles.image} source={{ uri: Datastore.ws.img("products", this.state.value.uuid, 'right', '300x300') }} />
					<Text style={GlobalStyles.imageText}>Right</Text>
				</View>
				
				<View>
                    {/*<Text style={styles.text}>
						Click CONFIRM to confirm that this product matches the one in the store to every detail.
					</Text>
					<TouchableHighlight style={styles.buttonConfirm} onPress = {this.onPress} underlayColor='#A0F584'>
						<Text style={GlobalStyles.buttonText}>CONFIRM</Text>
					</TouchableHighlight>*/}
                    {this.renderConfirm()}
					<Text style={styles.text}>
						Click CLONE AND EDIT if there is any difference between the product in the store and this.
						On the next page you will be able to edit the information.
					</Text>
					<TouchableHighlight style={[styles.buttonConfirm, styles.buttonClone]} onPress = {this.onEdit} underlayColor='#FFD599'>
						<Text style={GlobalStyles.buttonText}>CLONE AND EDIT</Text>
					</TouchableHighlight>
				</View>

			</ScrollView>

			</View>
		);
	},


	onPress: function()
	{

		// call getValue() to get the values of the form
		
		var value = this.state.value;

		console.log("Valid! [ValidateProduct onPress()]", value);

		if (value) { // if validation fails, value will be null
			// Copy value because it is not extensible, then add "private" values
			if(!Datastore.M.credentials || !Datastore.M.credentials.name || !Datastore.M.credentials.affiliation )
				AlertIOS.alert('Credentials needed!', 'Please go to \"Introduction\" and fill in the information', [{text: 'OK'}] );
			else {

				var newVal = {};
				newVal.product = Datastore.clone(this.state.value); // foodType and ageGroup gets name
				newVal.country = Datastore.M.country;
				newVal.location = Datastore.clone(Datastore.M.location);
				// Convert location to readable info


				//newVal.location.incomeType = Models.incomeTypes.meta.map[newVal.location.incomeType];
				//newVal.location.storeType = Models.storeTypes.meta.map[newVal.location.storeType];
				//newVal.location.storeBrand = Datastore.data.one('storeBrands', {_id:newVal.location.storeBrand}).name;

				newVal.credentials = Datastore.M.credentials;
				newVal.timeOfRegistration = Date.now(); // UTC in seconds

				//console.log("  this,state", this.state );
				
				if( this.state.hasOwnProperty('initialPosition')){
					newVal.gpsLocation = this.state.initialPosition;
				}else{
					newVal.gpsLocation = {};
				}

				
				
				// Create a unique "name":
				newVal.name = Datastore.shortid.generate();

				// Strip local _id fields
				newVal = Datastore.data.removeIDs( newVal );
				// Registrations is sortable by location hash
				newVal.locationID = Datastore.M.location.hash;
			   
				console.log("-------------------------------");
				console.log("# Saving Registration:", newVal);

				//Datastore.data.addu("registrations", newVal);


				/*var locationRegistration = {};
				locationRegistration.locationID = Datastore.M.location._id;
				locationRegistration.value = newVal;
				console.log("# Saving location registration", locationRegistration);
				Datastore.data.add("locationRegistrations", locationRegistration);*/

				//this.props.navigator.popN(2); // pop back to view registrations past select product
				this.props.navigator.push({
					onLeftButtonPress: () => this.props.navigator.pop(),
					leftButtonTitle: 'Back',
				    component: RegisterPriceAndPromo,
                    title: 'Price Information',
                    displayName: 'RegisterPriceAndPromo',
                    passProps: { productToRegister: newVal}
				});
			}
		}
	},

	onEdit: function()
	{
		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Register Product',
			component: RegisterProduct,
			passProps: { getProductData: true }

		});
	}
});



var styles = StyleSheet.create({
	doubleButtonContainer: {
		flexDirection: 'row'
	},
	// Red button (Copy)
	buttonConfirm: {
		height: 36,
		flex: 1,
		backgroundColor: '#44da5e',
		borderWidth: 0,
		borderRadius: 18.5,
		marginBottom: 15,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	// Green button (Use)
	buttonClone: {
		backgroundColor: '#ff9600'
	},
	text: {
		marginBottom: 15,
		marginTop: 15
	}
});



module.exports = ValidateProduct;