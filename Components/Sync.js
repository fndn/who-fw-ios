'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS
} = React;


var Sync = React.createClass({

	render: function(){
		return (
			<View style={GlobalStyles.container}>
				<Text style={styles.welcome}>
					Sync
				</Text>
			</View>);
	}
});

module.exports = Sync;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#09F'
	}
});
