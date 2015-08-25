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
        EnergyKj:{
            editable: false,
            label: 'Energy (KJ)'
        },
        EnergyKcal:{
            editable: false,
            label: 'Energy (kcal)'
        },
        Fat:{
            editable: false,
            label: 'Fat (g)'
        },
        FatOfWhichSaturates:{
            editable: false,
            label: 'Fat of which saturates (g)'
        },
        FatOfWhichTrans:{
            editable: false,
            label: 'Fat of which trans (g)'
        },
        Carbohydrate:{
            editable: false,
            label: 'Carbohydrate (g)'
        },
        CarbohydrateOfWhichSugars:{
            editable: false,
            label: 'Carbohydrate of which sugars (g)'
        },
        CarbohydrateOfWhichLactose:{
            editable: false,
            label: 'Carbohydrate of which lactose (g)'
        },
        Protein:{
            editable: false,
            label: 'Protein (g)'
        },
        Salt:{
            editable: false,
            label: 'Salt (g)'
        },
        Sodium:{
            editable: false,
            label: 'Sodium (g)'
        },
        ServingSize:{
            editable: false,
            label: 'Serving size (g)'
        }
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
    AlertIOS
    } = React;

var ValidateProduct = React.createClass({

    getInitialState: function() {

        var data = Datastore.cloneObject(Datastore.MemoryStore.product);
        //Models.storeTypes.meta.map["SUP"]
        console.log("getInitialState, ", data);
        data.foodType = Models.foodTypes.meta.map[data.foodType];
        data.ageGroup = Models.ageGroups.meta.map[data.ageGroup];

        //console.log(Models.ageGroups.meta.map["FOUR"]);
        return {
            options: options,
            value: data,
            validateBool: {boolValue:false},
            nutBool: {boolValue:true},
            nutHundredValue: data.nutritionalPr100g,
            nutServingValue: data.nutritionalPrServing
        };
    },

    render: function(){
        //console.log(this.state.options);
        //var forms = "";


        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                <Form
                    ref="form"
                    type={Models.ProductEvaluation()}
                    options={this.state.options}
                    value={this.state.value}
                    onChange={this.onChange}
                    />
                <Text style={styles.title}>
                    Nutritional Information
                    Pr 100g
                </Text>
                <Form
                    ref="form2"
                    type={Models.Nutrition()}
                    options={this.state.options}
                    value={this.state.nutHundredValue}
                    onChange={this.onChange2}
                    />
                <Text style={styles.title}>
                    Pr serving
                </Text>
                <Form
                    ref="form3"
                    type={Models.NutritionServing()}
                    options={this.state.options}
                    value={this.state.nutServingValue}
                    onChange={this.onChange3}
                    />
                <View style={styles.container}>
                    <TouchableHighlight style={[styles.button,styles.button_notlast]} onPress = {this.onPress} underlayColor='#ABF499'>
                        <Text style={styles.buttonText}>Use this</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress = {this.onEdit} underlayColor='#F4B599'>
                        <Text style={styles.buttonText}>Use as new</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        );
    },

    onChange: function(value)
    {
        this.setState({options: options, value: value});
    },

    onChange2: function(value)
    {
        this.setState({nutHundredValue: value});
    },

    onChange3: function(value)
    {
        this.setState({nutServingValue: value});
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
                var value2 = this.refs.form2.getValue();
                var value3 = this.refs.form3.getValue();
                var newVal = {};
                newVal.product = Datastore.cloneObject(value);
                newVal.product.nutritionalPr100g = Datastore.cloneObject(value2);
                newVal.product.nutritionalPrServing = Datastore.cloneObject(value3);
                newVal.brand = Datastore.MemoryStore.brand;
                newVal.country = Datastore.MemoryStore.country;
                newVal.location = Datastore.MemoryStore.location;
                newVal.storeType = Datastore.MemoryStore.storeType;
                newVal.credentials = Datastore.MemoryStore.credentials;
                newVal.timeOfRegistration = Date.now(); // UTC in seconds

                console.log("TODO: Register product in registrations");
                console.log("product info validated:", newVal);

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
    container: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    // Red button (Copy)
    button: {
        height: 36,
        flex: 1,
        backgroundColor: '#F56E6E',
        borderColor: '#F56E6E',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    // Green button (Use)
    button_notlast: {
        backgroundColor: '#A0D16F',
        borderColor: '#A0D16F',
        marginRight: 10
    }
});



module.exports = ValidateProduct;