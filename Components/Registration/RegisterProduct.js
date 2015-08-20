/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var Datastore       = require('../Datastore');
var Models          = require('../Models');
var t               = require('tcomb-form-native');

var Form = t.form.Form;

var options = {
    fields:{
        value:{
            label:'Some Label'

        }
    }
}; // optional rendering options (see documentation)

var nutBoolOptions = {
    fields:{
        boolValue:{ label:'Nutritional information available'}
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
    ScrollView
    } = React;

var RegisterProduct = React.createClass({

    getInitialState: function() {
        return {
            options: options,
            value: null,
            nutBool: {boolValue:false},
            nutHundredValue: null,
            nutServingValue: null
        };
    },

    render: function(){
        //console.log(this.state.options);
        //var forms = "";

        if(this.state.nutBool.boolValue)
        {
            return (
                <ScrollView/*TODO: Add styling*/>
                    <Form
                        ref="form"
                        type={Models.Product()}
                        options={this.state.options}
                        value={this.state.value}
                        onChange={this.onChange}
                    />

                    <Form
                        type={Models.SimpelBool()}
                        options={nutBoolOptions}
                        value={this.state.nutBool}
                        onChange={this.onNutritionInfoAvailableChange}
                        />

                    <Text style={styles.title}>
                        Nutritional Information
                        Pr 100g
                    </Text>
                    <Form
                        ref="form2"
                        type={Models.Nutrition()}
                        value={this.state.nutHundredValue}
                        onChange={this.onChange2}
                    />
                    <Text style={styles.title}>
                        Nutritional Information
                        Pr serving
                    </Text>
                    <Form
                        ref="form3"
                        type={Models.NutritionServing()}
                        value={this.state.nutServingValue}
                        onChange={this.onChange3}
                        />
                    <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableHighlight>
                </ScrollView>
            );
        }
        else {
            return (
                <ScrollView /*TODO: Add styling*/>
                    <Form
                        ref="form"
                        type={Models.Product()}
                        options={this.state.options}
                        value={this.state.value}
                        onChange={this.onChange}
                        />
                    <Form
                        type={Models.SimpelBool()}
                        options={nutBoolOptions}
                        value={this.state.nutBool}
                        onChange={this.onNutritionInfoAvailableChange}
                        />
                    <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableHighlight>
                </ScrollView>
            );
        }
    },

    onChange: function(value)
    {
        console.log(value);

        this.setState({options: options, value: value});

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

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.state.value;
        if (value) { // if validation fails, value will be null
            // Copy value because it is not extensible, then add "private" values
            var value2 = this.state.nutHundredValue;
            var value3 = this.state.nutServingValue;
            var newVal = JSON.parse(JSON.stringify(value));
            newVal.nutritionalPr100g = JSON.parse(JSON.stringify(value2));
            newVal.nutritionalPrServing = JSON.parse(JSON.stringify(value3));
            //newVal.country = Datastore.Session.Get('country')._id;
            //newVal.brand = Datastore.Session.Get('brand')._id;
            console.log("TODO: Store product information and review");
            console.log("product info:", newVal);
            //Datastore.add('products', value);
            //Datastore.Set("name", value.name);
            //Datastore.add('locations', value);
            //this.props.navigator.pop();
        }
    }
});



var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 0,
        padding: 20,
        backgroundColor: '#ffffff'
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
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});



module.exports = RegisterProduct;