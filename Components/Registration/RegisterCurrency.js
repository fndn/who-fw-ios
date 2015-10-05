/**
 * Created by JacobMac on 19/08/15.
 */
'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var t               = require('tcomb-form-native');

var Models          = require('../Models');
var GlobalStyles 	= require('../../Styles/GlobalStyles');


var Form = t.form.Form;

var options = {
    fields:{
        currency:{
            help:'Three letter format (ex: EUR)',
            autoCapitalize: 'characters'
        }
    }
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

var RegisterCurrency = React.createClass({


    render: function(){

        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                <Form
                    ref="form"
                    type={Models.Currency()}
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
            var newVal = Datastore.clone(value);
            //newVal.country = Datastore.M.country.name;
            console.log("Register Currency add: " , newVal);
            Datastore.data.add('currencies', newVal)
            this.props.route.callback( newVal.currency );
            this.props.navigator.pop();
        }
    }
});


module.exports = RegisterCurrency;