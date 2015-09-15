/**
 * Created by JacobMac on 20/08/15.
 */


'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var Datastore       = require('../Datastore');
var Models          = require('../Models');
var t               = require('tcomb-form-native');
var RegisterProduct = require('./RegisterProduct');
var CompleteRegistration    = require('./CompleteRegistration');

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
		other: {disabled: true}
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
var ValidateProduct = React.createClass({

	getInitialState: function() {



		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) =>
		{
			if(event.data.route.component.displayName === "ValidateProduct") {
				//console.log("ValidateProduct DATA: " , this.fillData());
				this.setState(this.fillData());
			}
			//console.log(event.data.route.component.displayName);

		});

		return this.fillData();
	},

	fillData: function()
	{
		var data = Datastore.cloneObject(Datastore.MemoryStore.product);
		//Models.storeTypes.meta.map["SUP"]
		console.log("getInitialState, ", Models.brands);
		data.foodType = Models.foodTypes.meta.map[data.foodType];
		data.ageGroup = Models.ageGroups.meta.map[data.ageGroup];
        data.brand = Datastore.one('brands', data.brand).name;

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
			initialPosition: null
		};
	},

	componentDidMount: function() {
		navigator.geolocation.getCurrentPosition(
			(initialPosition) => this.setState({initialPosition}),
			(error) => { this._noGPS(error)},
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	},

	_noGPS: function(err){
		alert(err.message);
		//this.setState({'initialPosition':{'coords':{}} });
		this.setState({'initialPosition':{} });

	},


	render: function(){

		return (
			<ScrollView style={GlobalStyles.scrollViewList}>
				<Form
					ref="form"
					type={Models.ProductEvaluation()}
					options={this.state.options}
					value={this.state.value}
					/>
				<Text style={GlobalStyles.title}>
					Nutritional Information
					Pr 100g
				</Text>
				<Form
					ref="form2"
					type={Models.Nutrition()}
					options={this.state.options}
					value={this.state.value.nutritionalPr100g}
					/>
				<Text style={GlobalStyles.title}>
					Pr serving
				</Text>
				<Form
					ref="form3"
					type={Models.NutritionServing()}
					options={options}
					value={this.state.value.nutritionalPrServing}
					/>
				<Text style={GlobalStyles.title}>
					Visual information
				</Text>
				<Form
					ref="form4"
					type={Models.VisualInformation()}                    
					options={options}
					value={this.state.value.visualInformation}
					/>

				<Text style={GlobalStyles.title}>
					Pictures
				</Text>

				<View style={GlobalStyles.imageGrid}>
					<Image style={GlobalStyles.image} source={{ uri: this.state.value.images.front }} />
					<Text style={GlobalStyles.imageText}>Front</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					<Image style={GlobalStyles.image} source={{ uri: this.state.value.images.back }} />
					<Text style={GlobalStyles.imageText}>Back</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					<Image style={GlobalStyles.image} source={{ uri: this.state.value.images.left }} />
					<Text style={GlobalStyles.imageText}>Left</Text>
				</View>
				<View style={GlobalStyles.imageGrid}>
					<Image style={GlobalStyles.image} source={{ uri: this.state.value.images.right }} />
					<Text style={GlobalStyles.imageText}>Right</Text>
				</View>
                <View>
                    <Text style={styles.text}>
                        Click CONFIRM to confirm that this product matches the one in the store to every detail.
                    </Text>
                    <TouchableHighlight style={styles.buttonConfirm} onPress = {this.onPress} underlayColor='#FF92A6'>
                        <Text style={GlobalStyles.buttonText}>CONFIRM</Text>
                    </TouchableHighlight>
                    <Text style={styles.text}>
                        Click CLONE AND EDIT if there is any difference between the product in the store and this.
                        On the next page you will be able to edit the information.
                    </Text>
                    <TouchableHighlight style={[styles.buttonConfirm, styles.buttonClone]} onPress = {this.onEdit} underlayColor='#FF92A6'>
                        <Text style={GlobalStyles.buttonText}>CLONE AND EDIT</Text>
                    </TouchableHighlight>
                </View>

			</ScrollView>
		);
	},

/*
 <View style={styles.doubleButtonContainer}>
 <TouchableHighlight style={[styles.button,styles.button_notlast]} onPress = {this.onPress} underlayColor='#C8E5F3'>
 <Text style={GlobalStyles.buttonText}>Submit</Text>
 </TouchableHighlight>
 <TouchableHighlight style={styles.button} onPress = {this.onEdit} underlayColor='#FF92A6'>
 <Text style={GlobalStyles.buttonText}>Clone &amp; Edit</Text>
 </TouchableHighlight>
 </View>
 */


	onPress: function()
	{

		// call getValue() to get the values of the form
		
		var value = this.refs.form.getValue();

		console.log("Valid! [ValidateProduct onPress()]", value);

		if (value) { // if validation fails, value will be null
			// Copy value because it is not extensible, then add "private" values
			if(!Datastore.MemoryStore.credentials || !Datastore.MemoryStore.credentials.name || !Datastore.MemoryStore.credentials.affiliation )
				AlertIOS.alert('Credentials needed!', 'Please go to \"Introduction\" and fill in the information', [{text: 'OK'}] );
			else {

				var newVal = {};
				newVal.product = Datastore.cloneObject(this.state.value); // foodType and ageGroup gets name
				newVal.country = Datastore.MemoryStore.country;
				newVal.location = Datastore.MemoryStore.location;
				newVal.credentials = Datastore.MemoryStore.credentials;
				newVal.timeOfRegistration = Date.now(); // UTC in seconds

				console.log("  this,state", this.state );
				
				if( this.state.hasOwnProperty('initialPosition')){
					newVal.gpsLocation = this.state.initialPosition;
				}else{
					newVal.gpsLocation = {};
				}

				
				
				// Create a unique "name":
				newVal.name = Datastore.ShortID.generate();

				// Strip local _id fields
				newVal = Datastore.removeIDs( newVal );
                newVal.locationID = Datastore.MemoryStore.location._id;
			   
				console.log("-------------------------------");
				console.log("# Saving Registration:", newVal);

				Datastore.add("registrations", newVal);


                /*var locationRegistration = {};
                locationRegistration.locationID = Datastore.MemoryStore.location._id;
                locationRegistration.value = newVal;
                console.log("# Saving location registration", locationRegistration);
                Datastore.add("locationRegistrations", locationRegistration);*/

				//this.props.navigator.popN(2); // pop back to view registrations past select product
                this.props.navigator.push({
                    onLeftButtonPress: () => this.props.navigator.popN(2),
                    leftButtonTitle: 'Products',
                   component: CompleteRegistration
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