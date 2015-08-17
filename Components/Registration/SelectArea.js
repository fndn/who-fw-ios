'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS
} = React;


var SelectArea = React.createClass({

	render: function(){
		return (
			<View style={GlobalStyles.container}>
				<Text style={styles.welcome}>
					SelectArea {/*this.props.name*/}
				</Text>
			</View>);
	}
});

module.exports = SelectArea;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#09F'
	}
});
