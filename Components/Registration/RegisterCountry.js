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
                    <TouchableHighlight style={styles.button} onPress = {this.onPress} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableHighlight>
            </ScrollView>
        );
    },

    onPress: function()
    {

        // call getValue() to get the values of the form

        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            console.log(value);
            Datastore.add('countries', value);
            this.props.navigator.pop();
        }
    }
});



var styles = StyleSheet.create({
    container: {
        //justifyContent: 'center',
        //marginTop: 50,
        backgroundColor: '#ffffff',
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
    button: {
        height: 36,
        flex: 1,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,

        alignSelf: 'stretch',
        justifyContent: 'space-around'
    }
});



module.exports = RegisterCountry;