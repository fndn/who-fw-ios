/**
 * Created by JacobMac on 20/08/15.
 */


'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var GlobalStyles 	= require('../../Styles/GlobalStyles');

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	NavigatorIOS,
	ScrollView,
	} = React;

var titleText = "Thank you for the input!\n\nThe registration will be pushed to the database next time you Sync. \n\nWould you like to register more products in this store?"

var CompleteRegistration = React.createClass({


	render: function(){
		return (
			<ScrollView
                style={[GlobalStyles.scrollViewContainer, GlobalStyles.scrollViewList] }
                automaticallyAdjustContentInsets = {false}>
				<Text style={styles.text}>
					{titleText}
				</Text>
				<TouchableHighlight style={styles.buttonConfirm}  onPress = {this.onProducts} underlayColor='#A0F584'>
					<Text style={GlobalStyles.buttonText}>
						> Register more products
					</Text>
				</TouchableHighlight>
                {/*<Text style={styles.text}>
					Or mark the store as complete?
				</Text>
				<TouchableHighlight style={styles.buttonConfirm}  onPress = {this.onComplete} underlayColor='#A0F584'>
					<Text style={GlobalStyles.buttonText}>
						> Complete
					</Text>
				</TouchableHighlight>
				*/}
				<Text style={styles.text}>
					Or continue in another store?
				</Text>
				<TouchableHighlight style={styles.buttonConfirm}  onPress = {this.onLocation} underlayColor='#A0F584'>
					<Text style={GlobalStyles.buttonText}>
						> Register new store location
					</Text>
				</TouchableHighlight>
				<Text style={styles.text}>
					Or review your registrations for this store?
				</Text>
				<TouchableHighlight style={styles.buttonConfirm}  onPress = {this.onReview} underlayColor='#A0F584'>
					<Text style={GlobalStyles.buttonText}>
						> View Registrations
					</Text>
				</TouchableHighlight>
			</ScrollView>
		);
	},

	onProducts: function()
	{
		Datastore.M.product = null;
		this.props.navigator.popToRoute(Datastore.M.SelectProductRoute);

	},

	onComplete: function()
	{
		Datastore.M.product = null;
		Datastore.M.location = null;
		// TODO: Set location to complete
		this.props.navigator.popToRoute(Datastore.M.SelectLocationRoute);
	},

	onLocation: function()
	{
		Datastore.M.product = null;
		Datastore.M.location = null;
		this.props.navigator.popToRoute(Datastore.M.SelectLocationRoute);
	},

	onReview: function () {
		Datastore.M.product = null;
		this.props.navigator.popToRoute(Datastore.M.ViewRegistrationsRoute);
	}
});



var styles = StyleSheet.create({
	buttonConfirm: {
		height: 36,
		backgroundColor: '#44da5e',
		borderWidth: 0,
		borderRadius: 18.5,
		marginTop: 15,
		marginBottom: 15,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	text: {
		marginTop: 20,
	}
});



module.exports = CompleteRegistration;