/**
 * Created by JacobMac on 19/08/15.
 */
'use strict';

var React 			        = require('react-native');
var Datastore 		        = require('fndn-rn-datastore');
var t                       = require('tcomb-form-native');

var Models                  = require('../Models');
var GlobalStyles 	        = require('../../Styles/GlobalStyles');
var CompleteRegistration    = require('./CompleteRegistration');


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

var RegisterPriceAndPromo = React.createClass({

    render: function(){

        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                <Form
                    ref="price_form"
                    type={Models.Price()}
                    options={options}
                    />
                <Form
                    ref="promo_form"
                    type={Models.Promotion()}
                    options={options}
                    />
                <TouchableHighlight
                    style={GlobalStyles.button}
                    onPress = {this.onPress}
                    underlayColor={GlobalStyles.colors.formHighlightColor}
                    >
                    <Text style={GlobalStyles.buttonText}>Register</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    },

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.refs.price_form.getValue();
        if (value) { // if validation fails, value will be null
            // Copy value because it is not extensible, then add "private" values
            var newVal = this.props.productToRegister;
            newVal.price = Datastore.clone(value);
            newVal.promotion = Datastore.clone(this.refs.promo_form.getValue());
            console.log("[Register Price] Registering product", newVal);
            Datastore.data.addu("registrations", newVal);

            if(!Datastore.M.locationRegistrations)
                Datastore.M.locationRegistrations = [];
            console.log("Before", Datastore.M.locationRegistrations);
            Datastore.M.locationRegistrations.push(newVal.product.hash);
            console.log("After", Datastore.M.locationRegistrations);
            Datastore.M.product = null;

            this.props.navigator.push({
                onLeftButtonPress: () => this.props.navigator.popN(3),
                leftButtonTitle: 'Products',
                component: CompleteRegistration
            });
        }
    }
});



var styles = StyleSheet.create({

});



module.exports = RegisterPriceAndPromo;