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
var RegisterCurrency        = require('./RegisterCurrency');


var Form = t.form.Form;

var options = {
    fields:{
        currentPrice:{keyboardType: 'numeric'},
        normalPrice:{keyboardType: 'numeric'}
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
    TouchableOpacity,
    NavigatorIOS,
    ScrollView
    } = React;

var _tmp_state = {};

var RegisterPriceAndPromo = React.createClass({

    getInitialState: function(){
        // Only pre-select currency
        if(_tmp_state.priceInfo && _tmp_state.priceInfo.currency) {
            var tempCurrency = _tmp_state.priceInfo.currency;
            _tmp_state.priceInfo = null;
            _tmp_state.promotionInfo = null;
            _tmp_state.priceInfo = {currency:tempCurrency};
        }
        return({
            priceInfo: _tmp_state.priceInfo,
            promotionInfo: _tmp_state.promotionInfo
        });
    },

    render: function(){

        return (
            <View style={GlobalStyles.scrollViewContainer}>
                <ScrollView
                    style={GlobalStyles.scrollViewList}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={false}
                    scrollsToTop={true}>

                    <Form
                        ref="price_form"
                        type={Models.Price()}
                        value={this.state.priceInfo}
                        options={options}
                        onChange={(value) =>{_tmp_state.priceInfo = value}}
                        />

                    <TouchableOpacity
                        style={styles.addCurrencyButton}
                        onPress = {this.onAddCurrency}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>

                    <Form
                        ref="promo_form"
                        type={Models.Promotion()}
                        value={this.state.promotionInfo}
                        options={options}
                        onChange={(value) =>{_tmp_state.promotionInfo = value}}
                        />


                    <TouchableHighlight
                        style={GlobalStyles.button}
                        onPress = {this.onPress}
                        underlayColor={GlobalStyles.colors.formHighlightColor}
                        >
                        <Text style={GlobalStyles.buttonText}>Register</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    },

    onAddCurrency: function () {
        this.storeTmpState();

        this.props.navigator.push({
            onLeftButtonPress: () => this.props.navigator.pop(),
            leftButtonTitle: 'Cancel',
            title: "Register Currency",
            displayName: 'RegisterCurrency',
            component: RegisterCurrency,
            callback: this.onReturnFromAddCurrency
        });
    },

    storeTmpState: function () {
        //console.log("## Storing TPM state", _tmp_state);

        this.setState({
            promotionInfo: _tmp_state.promotionInfo,
            priceInfo: _tmp_state.priceInfo
        });
    },

    onReturnFromAddCurrency: function(currency)
    {
        //console.log("Returned with", currency);
        _tmp_state.priceInfo.currency = currency;
        this.storeTmpState();
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
            Datastore.data.add("registrations", newVal);

            if(!Datastore.M.locationRegistrations)
                Datastore.M.locationRegistrations = [];

            Datastore.M.locationRegistrations.push(newVal.product.hash);

            Datastore.M.product = null;

            this.props.navigator.push({
                onLeftButtonPress: () => this.props.navigator.popToRoute(Datastore.M.SelectProductRoute),
                leftButtonTitle: 'Products',
                title: "Complete Registration",
                displayName: 'CompleteRegistration',
                component: CompleteRegistration
            });
        }
    }
});


// Heights:
// text field: 78.5
// picker: 257.5

var styles = StyleSheet.create({
    addCurrencyButton:{
        position: 'absolute',
        top: 78.5 * 2,
        right: 0

    },
    buttonText:
    {
        fontSize: 17,
        color: '#4b92db'
    }
});



module.exports = RegisterPriceAndPromo;