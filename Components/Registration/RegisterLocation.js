'use strict';

var React 			        = require('react-native');
var GlobalStyles 	        = require('../../Styles/GlobalStyles');
var Datastore               = require('../Datastore');
var Models                  = require('../Models');
var t                       = require('tcomb-form-native');
var RegisterStoreBrand      = require('./RegisterStoreBrand');

var Form = t.form.Form;

var options = {

}; // optional rendering options (see documentation)

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
    TouchableOpacity,
	ActivityIndicatorIOS,
	NavigatorIOS,
	ScrollView
	} = React;

var navigatorEventListener;

var RegisterLocation = React.createClass({
    getInitialState: function() {

        return {
            value: null
        };
    },

	render: function(){

		//console.log("stored country: " + Datastore.all('sessionCountry'));

		return (
            <View style={GlobalStyles.scrollViewContainer}>
                <ScrollView style={GlobalStyles.scrollViewList} automaticallyAdjustContentInsets={false}>
                    <Form
                        ref="form"
                        type={Models.Location()}
                        options={options}
                        value={this.state.value}
                        onChange={this.onChange}/>

                    <TouchableOpacity
                        style={styles.addStoreBrandButton}
                        onPress = {this.onAddStoreBrand}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>

                    <TouchableHighlight
                        style={GlobalStyles.button}
                        onPress = {this.onPress}
                        underlayColor={GlobalStyles.colors.formHighlightColor}>
                        <Text style={GlobalStyles.buttonText}>Save</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
		);
	},

    onAddStoreBrand: function()
    {
        console.log("[RegisterLocation] Add Store Brand");
        this.props.navigator.push({
            leftButtonTitle: 'Cancel',
            onLeftButtonPress: () => this.props.navigator.pop(),
            title: 'Register Store Brand',
            component: RegisterStoreBrand

        });
    },

    onChange: function(value)
    {
        //console.log(value);
        this.setState({value: value});
    },

	onPress: function()
	{

		// call getValue() to get the values of the form

		var value = this.refs.form.getValue();
		if (value) { // if validation fails, value will be null
			// Copy value because it is not extensible, then add "private" values
			var newVal = JSON.parse(JSON.stringify(value));
			//newVal.country = Datastore.Session.Get('country')._id;
			newVal.country = Datastore.MemoryStore.country.name;

            newVal.storeBrand = Datastore.one('storeBrands', newVal.storeBrand).name;

			console.log("new location: ", newVal);
			Datastore.add('locations', newVal);
			//Datastore.Set("name", value.name);
			//Datastore.add('locations', value);
			this.props.navigator.pop();
		}
	}
});


// Heights:
// text field: 78.5
// picker: 257.5

var styles = StyleSheet.create({
    addStoreBrandButton:{
        position: 'absolute',
        top: 78.5 * 4 + 257.5,
        right: 0

    },
    addStoreTypeButton:{
        position: 'absolute',
        top: 78.5 * 4 + 257.5 * 2,
        right: 0

    },

    buttonText:
    {
        fontSize: 17,
        color: '#4b92db'
    }
});



module.exports = RegisterLocation;