'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectCountry 	= require('./SelectCountry')
var Datastore       = require('../Datastore');
var t               = require('tcomb-form-native');

var Form = t.form.Form;

var Person = t.struct({
    name: t.Str,              // a required string
    countryCode: t.maybe(t.Str)  // an optional string

});

var options = {}; // optional rendering options (see documentation)

var {
    StyleSheet,
    View,
    Text,
    Component,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    NavigatorIOS
    } = React;

var RegisterCountry = React.createClass({

    //constructor( props ){
    //    super(props);
    //}


    render: function(){

        return (
            <View style={styles.container}>
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                    />
                <TouchableHighlight style={styles.button} onPress = {this.onPress} underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        );
    },

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null

            Datastore.Set("name", value.name);

            this.props.navigator.pop();
        }
    },

    componentDidMount: function()
    {
        console.log("RegisterCountry did mount");
    }
});



var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff',
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



module.exports = RegisterCountry;