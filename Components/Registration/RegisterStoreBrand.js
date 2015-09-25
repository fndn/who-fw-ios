'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var t               = require('tcomb-form-native');

var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectCountry 	= require('./SelectCountry');
var Models          = require('../Models');

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

var RegisterStoreBrand = React.createClass({

	render: function(){
		return (
			<ScrollView style={GlobalStyles.scrollViewList}>
				<Form
					ref="form"
					type={Models.StoreBrand()}
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
			var newVal = Datastore.clone(value);
			newVal.country = Datastore.M.country.name;
			newVal.countryCode = Datastore.M.country.countryCode;

			console.log("[RegisterStoreBrand]", newVal);

            this.props.route.callback(Datastore.data.add('storeBrands', newVal).insert_id);
			this.props.navigator.pop();
		}
	}
});



var styles = StyleSheet.create({

});



module.exports = RegisterStoreBrand;