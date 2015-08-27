/**
 * Created by JacobMac on 20/08/15.
 */
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

var Form = t.form.Form;


var options = {
    fields:{
        name:{
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
        cartoons: {disabled: true},
        picturesOfInfantsOrYoungChildren: {disabled : true},
        picturesOfMothers: {disabled: true},
        comparativeClaims: {disabled: true},
        nutrientContentClaims: {disabled: true},
        healthClaims: {disabled: true},
        other: {disabled: true}
    }
}; // optional rendering options (see documentation)

var nutBoolOptions = {
    fields:{
        boolValue:{ label:'Nutritional information available'}
    }
};

var validateBoolOptions =
{
    fields:{
        boolValue:{ label:'I confirm that info is correct'}
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
                console.log("DATA: " , this.fillData());
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
        //console.log("getInitialState, ", data);
        data.foodType = Models.foodTypes.meta.map[data.foodType];
        data.ageGroup = Models.ageGroups.meta.map[data.ageGroup];

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
                    options={this.state.options}
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

                <View style={styles.doubleButtonContainer}>
                    <TouchableHighlight style={[styles.button,styles.button_notlast]} onPress = {this.onPress} underlayColor='#ABF499'>
                        <Text style={GlobalStyles.buttonText}>Submit</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress = {this.onEdit} underlayColor='#F4B599'>
                        <Text style={GlobalStyles.buttonText}>Clone & Edit</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        );
    },


    onPress: function()
    {

        // call getValue() to get the values of the form
        console.log("Valid!");
        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            // Copy value because it is not extensible, then add "private" values
            if(!Datastore.MemoryStore.credentials || !Datastore.MemoryStore.credentials.name || !Datastore.MemoryStore.credentials.affiliation )
                AlertIOS.alert('Credentials needed!', 'Please go to \"Introduction\" and fill in the information', [{text: 'OK'}] );
            else {

                var newVal = {};
                newVal.product = Datastore.cloneObject(this.state.value); // foodType and ageGroup gets name
                //newVal.product = Datastore.cloneObject(Datastore.MemoryStore.product); // foodType and ageGroup are abbreviations

                newVal.brand = Datastore.MemoryStore.brand;
                newVal.country = Datastore.MemoryStore.country;
                newVal.location = Datastore.MemoryStore.location;
                newVal.storeType = Datastore.MemoryStore.storeType;
                newVal.credentials = Datastore.MemoryStore.credentials;
                newVal.timeOfRegistration = Date.now(); // UTC in seconds

                console.log("  this,state", this.state );
                
                if( this.state.hasOwnProperty('initialPosition')){
                    newVal.gpsLocation = this.state.initialPosition;
                }else{
                    newVal.gpsLocation = {};
                }

                console.log("product info validated:", newVal);

                // Create a unique "name":
                newVal.name = Datastore.ShortID.generate();

                // Strip local _id fields
                newVal = Datastore.removeIDs( newVal );

                Datastore.add("registrations", newVal);

                //this.props.navigator.pop();
            }
        }
    },

    onEdit: function()
    {
        this.props.navigator.push({
            leftButtonTitle: '< Back',
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
    button: {
        height: 36,
        flex: 1,
        backgroundColor: '#FF2851',
        borderColor: '#FF2851',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    // Green button (Use)
    button_notlast: {
        backgroundColor: '#54C7FC',
        borderColor: '#54C7FC',
        marginRight: 10
    }
});



module.exports = ValidateProduct;