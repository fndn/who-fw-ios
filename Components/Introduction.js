'use strict';

var React 			= require('react-native');
var t               = require('tcomb-form-native');
var Datastore 		= require('fndn-rn-datastore');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var Models          = require('./Models');


var Form = t.form.Form;

var {
	AppRegistry,
	StyleSheet,
	View,
	ScrollView,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image
} = React;


var { Icon, } = require('react-native-icons');


var Introduction = React.createClass ({

	loadCreds: function(){
		var self = this;
		Datastore.data.init(function(){

			var data = Datastore.data.last("credentials");
			//console.log('Introduction Datastore.init CB', data );
			self.setState({value: data });
			Datastore.M.credentials = data;
		});
	},

	getInitialState: function() {
		this.loadCreds();
		return {
			value: {}
		};
	},

	render: function(){
		return (
			<View style={styles.unbg}>
			<ScrollView>
				<View style={styles.imagewrap}>
					<Image
						style={styles.logo}
						resizeMode="contain"
						source={require('image!who_logo')}/>
				</View>

				<View style={styles.login}>
					<Form
						ref="form"
						type={Models.Respondent()}
						value={this.state.value}
						onChange={this.onChange}
						/>
				</View>
			</ScrollView>
			</View>
		);
	},

	onChange: function(value){

		var v = Datastore.clone(value);
		console.log('v', v);

		Datastore.M.credentials = value;
		this.setState({value:value});
		Datastore.data.add("credentials", value);
	}


});

module.exports = Introduction;


// Local styles

// UN Blue: #4B92DB
// https://en.wikipedia.org/wiki/Azure_(color)
// https://en.wikipedia.org/wiki/Flag_of_the_United_Nations

var styles = StyleSheet.create({

	unbg:{
		flex: 1,
		backgroundColor: '#4B92DB',

	},

	login: {
		padding: 20,
		paddingBottom: 300,
	},
	imagewrap: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: 300,
	},
	logo: {
		width: 250,
	},

	textbox:{
		color: '#f00',
	}


});
