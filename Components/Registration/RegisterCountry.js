'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var t               = require('tcomb-form-native');

var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectCountry 	= require('./SelectCountry');
var Models          = require('../Models');

var Form = t.form.Form;

var options = {
    fields:{
        countryCode:{
            autoCapitalize: 'characters'
        }
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

var RegisterCountry = React.createClass({

	render: function(){
		return (
			<ScrollView style={GlobalStyles.scrollViewList}>
				<Form
					ref="form"
					type={Models.Country()}
					options={options}/>
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

	onPress: function(){
		var value = this.refs.form.getValue();
		if (value) {
			Datastore.data.add('countries', Datastore.clone(value) );
			this.props.navigator.pop();
		}
	}
});

module.exports = RegisterCountry;
