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
var SelectCountry 	= require('./Registration/SelectCountry');
var RegisterCountry = require('./Registration/RegisterCountry');

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


var Registrations = React.createClass ({

	render: function(){
		return (
			<NavigatorIOS
                ref="nav"
				style={GlobalStyles.container_fs}
				initialRoute={{
					component: SelectCountry,
					rightButtonTitle: 'Add',
					onRightButtonPress: () => this.OpenAddCountry(),
					title: 'Select Country'
				}}/>
		);
	},

    OpenAddCountry: function ()
    {
        this.refs.nav.navigator.push({
                title: 'Register Country',
                component: RegisterCountry,
                leftButtonTitle: 'Cancel',
                onLeftButtonPress: () => { this.refs.nav.navigator.pop();}
                //rightButtonTitle: 'Done'
            });
    }


});

module.exports = Registrations;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#444'
	}
});
