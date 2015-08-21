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

Form.i18n = {
    optional: ' [opt]'
};

var options = {
    fields:{
        name:{
            label: 'Some name',
            editable: true
        },
        EnergyKj:{
            label: 'Energy (KJ)'
        },
        EnergyKcal:{
            label: 'Energy (kcal)'
        },
        Fat:{
            label: 'Fat (g)'
        },
        FatOfWhichSaturates:{
            label: 'Fat of which saturates (g)'
        },
        FatOfWhichTrans:{
            label: 'Fat of which trans (g)'
        },
        Carbohydrate:{
            label: 'Carbohydrate (g)'
        },
        CarbohydrateOfWhichSugars:{
            label: 'Carbohydrate of which sugars (g)'
        },
        CarbohydrateOfWhichLactose:{
            label: 'Carbohydrate of which lactose (g)'
        },
        Protein:{
            label: 'Protein (g)'
        },
        Salt:{
            label: 'Salt (g)'
        },
        Sodium:{
            label: 'Sodium (g)'
        },
        ServingSize:{
            label: 'Serving size (g)'
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
        var data = null;
        var hundredData = null;
        var servingData = null;
        var nutBoolData = {boolValue:false};
        if(this.props.getProductData)
        {
            var data = JSON.parse(JSON.stringify(Datastore.MemoryStore.product));
            hundredData = data.nutritionalPr100g;
            servingData = data.nutritionalPrServing;
            nutBoolData = {boolValue:true};
        }

        return {
            options: options,
            value: data,
            nutBool: nutBoolData,
            nutHundredValue: hundredData,
            nutServingValue: servingData
        };
    },

    render: function(){

        //var forms = "";
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
                    <Text style={styles.title}>
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
                    <Text style={styles.title}>
                        Per serving
                    </Text>
                    <Form
                        ref="form3"
                        type={Models.NutritionServing()}
                        value={this.state.nutServingValue}
                        options={this.state.options}
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
                <ScrollView style={GlobalStyles.scrollViewList}>
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

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            // Copy value because it is not extensible, then add "private" values
            var value2 = this.refs.form2.getValue();
            var value3 = this.refs.form3.getValue();

            var newVal = JSON.parse(JSON.stringify(value));
            newVal.nutritionalPr100g = JSON.parse(JSON.stringify(value2));
            newVal.nutritionalPrServing = JSON.parse(JSON.stringify(value3));
            newVal.brand = Datastore.MemoryStore.brand.name;
            //newVal.country = Datastore.Session.Get('country')._id;
            //newVal.brand = Datastore.Session.Get('brand')._id;
            console.log("TODO: Store product information and review");
            console.log("product info:", newVal);
        /*    var entry = Datastore.add('products', newVal);
            //Datastore.Set("name", value.name);
            //Datastore.add('locations', value);
            if(this.props.getProductData)
            {
                Datastore.MemoryStore.product = Datastore.one('products', entry);
            }

            this.props.navigator.pop();
            */
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