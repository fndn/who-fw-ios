
'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var SelectCountry 	= require('./Registration/SelectCountry');
var RegisterCountry = require('./Registration/RegisterCountry');

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


var Registrations = React.createClass ({

	render: function(){
		return (
			<NavigatorIOS
                ref="nav"
                tintColor={'#4B92DB'}
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

