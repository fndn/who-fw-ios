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


class Introduction extends Component {

	render(){
		return (
			<View style={GlobalStyles.container}>
				<Text style={styles.welcome}>
					Introduction
				</Text>
			</View>
		);
	}
}

module.exports = Introduction;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#444'
	}
});
