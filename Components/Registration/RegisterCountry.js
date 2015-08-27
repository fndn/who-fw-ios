'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectCountry 	= require('./SelectCountry');
var Datastore       = require('../Datastore');
var Models          = require('../Models');
var t               = require('tcomb-form-native');

var Form = t.form.Form;


var options = {}; // optional rendering options (see documentation)

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

var RegisterCountry = React.createClass({

    //constructor( props ){
    //    super(props);
    //}

    render: function(){
        return (
            <ScrollView style={GlobalStyles.scrollViewList}>
                <Form
                    ref="form"
                    type={Models.Country()}
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
            //var newVal = JSON.parse(JSON.stringify(value));
            var newVal = Datastore.cloneObject(value); // about 30x faster :)
            //console.log(newVal);
            Datastore.add('countries', newVal)
            this.props.navigator.pop();
        }
    }
});



var styles = StyleSheet.create({

});



module.exports = RegisterCountry;