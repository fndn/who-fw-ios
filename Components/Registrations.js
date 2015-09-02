
'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var SelectCountry 	= require('./Registration/SelectCountry');
var RegisterCountry = require('./Registration/RegisterCountry');

// dev
var RegisterProduct   = require('./Registration/RegisterProduct');

var {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	NavigatorIOS
} = React;

// SelectCountry

var Registrations = React.createClass ({

	render: function(){
		return (
			<NavigatorIOS
                ref="nav"
                tintColor={'#4B92DB'}
				style={GlobalStyles.container_fs}
				initialRoute={{
					component: RegisterProduct,
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

