'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var t               = require('tcomb-form-native');
var Models          = require('./Models');
var Datastore       = require('./Datastore');


var Form = t.form.Form;

// This is global
Form.i18n = {
    optional: ' (?)',
    required: ''
};

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image
} = React;


var { Icon, } = require('react-native-icons');


var Introduction = React.createClass ({
    getInitialState: function() {

        var data = Datastore.cloneObject(Datastore.MemoryStore.credentials);

        //console.log(Models.ageGroups.meta.map["FOUR"]);
        return {
            value: data
        };
    },

	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.imagewrap}>
					<Image
						style={styles.logo}
						resizeMode="contain"
						source={require('image!who_logo')}/>
				</View>

                <Text style={styles.text}>
                    Please fill in!
                </Text>

                <View style={styles.login}>
                    <Form
                        ref="form"
                        type={Models.Respondent()}
                        value={this.state.value}
                        onChange={this.onChange}
                        />
                </View>

			</View>


		);
	},

    onChange: function(value){
        Datastore.MemoryStore.credentials = value;
        this.setState({value:value});
    }


});

module.exports = Introduction;

// Local styles
var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
    },
    login: {
        padding: 20,
        width: 300
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

	text : {
		fontSize: 18,
		color: '#F90'
	},

	beer: {
		width: 32,
		height: 32,
	}
});
