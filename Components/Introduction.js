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
		var data = Datastore.data.last("credentials");
		this.setState({value: data });
		Datastore.M.credentials = data;
	},

	getInitialState: function() {
		var self = this;
		Datastore.data.init(function(){
			self.loadCreds();
		});

		return {
			value: {}
		};
	},

	componentWillMount: function(){
		this.loadCreds();
	},

	render: function(){
		return (
			<View style={styles.unbg}>
			<ScrollView
				keyboardDismissMode={'on-drag'}
				>
				<View style={styles.imagewrap}>
					<Image
						style={styles.logo}
						resizeMode="contain"
						source={require('image!who_logo')}/>
				</View>
                <View style={styles.welcome_wrap}>
                    <Text style={styles.welcome_text}>Availability of Commercially Produced Complementary Food Products in the Market Place in the WHO European Region</Text>
                </View>
				<View style={styles.login}>
                    <Text>{"\n"}</Text>
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

	imagewrap: {
		top: 5,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: 160,
	},
	logo: {
		width: 250,
	},

	login: {
		padding: 20,
		paddingBottom: 300,
		paddingTop: 10,
	},

	welcome_wrap: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		paddingTop: 30,
	},
	welcome_text: {
		color: '#fff',
		fontSize: 16,
        textAlign: 'center'
	}

});
