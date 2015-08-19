'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var Datastore       = require('./Datastore');

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
			<View style={styles.container}>
			  <View style={styles.page}>

			  	<Text style={styles.infotext}> {/* spacer */} </Text>

			  	<Text style={styles.infotext}>
					Text about how the Sync function(s) work.{"\n"}
					The app needs to connect to the internet to... {"\n"}

				</Text>

				
				<View style={styles.infobox}>
					<Text style={styles.infotext_title}>
						DOWNLOAD TYPE LISTS
					</Text>
					<Text style={styles.infotext_body}>
						This will update the local copies of {"\n"}
						Countries, StoreTypes, BrandNames, StandardProducts
					</Text>

					<TouchableHighlight style={styles.button} onPress = {this.onPressDownload} underlayColor='#99d9f4'>
						<Text style={styles.buttonText}>Download</Text>
					</TouchableHighlight>
				</View>

				<View style={styles.infobox}>
					<Text style={styles.infotext_title}>
						UPLOAD PRODUCT REGISTRATIONS
					</Text>
					<Text style={styles.infotext_body}>
						This will upload the registrations to the server. {"\n"}
						You have *x* un-synced registrations with *y* images.
					</Text>

					<TouchableHighlight style={styles.button} onPress = {this.onPressUpload} underlayColor='#99d9f4'>
						<Text style={styles.buttonText}>Upload</Text>
					</TouchableHighlight>
				</View>

              </View>
			</View>);	
	},

	onPressDownload: function(){
		console.log('onPressDownload');
	},

	onPressUpload: function(){
		console.log('onPressUpload');
	}

});

module.exports = Sync;

// Local styles
var styles = StyleSheet.create({
	welcome : {
		fontSize: 30,
		color: '#09F'
	},
	container: {
		backgroundColor: '#eee',
		flex: 1,
    },
    page: {
    	padding: 20,
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },

     infotext: {
    	fontSize: 12,
    	marginBottom: 10,
    },
    infotext_title: {
    	fontSize: 11,
    	fontWeight: 'bold',
    	color: '#555',
    	marginBottom: 6,
    },
    infotext_body: {
    	fontSize: 10,
    	color: '#444',
    	marginBottom: 10,
    	lineHeight: 14
    },

    infobox: {
    	borderTopWidth: 1,
    	borderBottomWidth: 1,
    	borderColor: '#ccc',
    	backgroundColor: '#fff',
    	padding: 10,
    	paddingLeft: 20,
    	paddingRight: 20,
    	margin: 0,
    	marginLeft: -20,
    	marginRight: -20,
    	marginBottom: 10,
    }
});
