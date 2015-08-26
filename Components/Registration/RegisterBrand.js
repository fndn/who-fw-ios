/**
 * Created by JacobMac on 19/08/15.
 */
'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var Datastore       = require('../Datastore');
var Models          = require('../Models');
var t               = require('tcomb-form-native');

var Form = t.form.Form;

var options = {

}; // optional rendering options (see documentation)

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

var RegisterBrand = React.createClass({


    render: function(){

        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                <Form
                    ref="form"
                    type={Models.Brand()}
                    options={options}
                    />
                <TouchableHighlight
                    style={GlobalStyles.button}
                    onPress = {this.onPress}
                    underlayColor={GlobalStyles.colors.formHighlightColor}
                    >
                    <Text style={GlobalStyles.buttonText}>Save</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    },

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            // Copy value because it is not extensible, then add "private" values
            var newVal = JSON.parse(JSON.stringify(value));
            newVal.country = Datastore.MemoryStore.country.name;
            Datastore.MemoryStore.brand = value
            console.log("RegisterBrand add: " , newVal);
            Datastore.add('brands', newVal);
            //Datastore.Set("name", value.name);
            //Datastore.add('locations', value);
            this.props.navigator.pop();
        }
    }
});



var styles = StyleSheet.create({

});



module.exports = RegisterBrand;