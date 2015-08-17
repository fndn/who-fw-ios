/**

1. Select Country
2. Select Area (city, addres, neighbourhood)
3. List Stores (chain, type)
4. List Brands (+)
5. List Products (+)
5.1 Enter Product info (.....)




**/
'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var SelectCountry 	= require('./Registration/SelectCountry')

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


class Registrations extends Component {

	render(){
		return (
			<NavigatorIOS
				style={GlobalStyles.container_fs}
				initialRoute={{
					component: SelectCountry,
					title: 'SelectCountry',
					passProps: { myProp: 'foo' },
				}}/>
		);
	}
}

module.exports = Registrations;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#444'
	}
});
