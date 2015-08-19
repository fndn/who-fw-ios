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
	ActivityIndicatorIOS,
	Image
} = React;


var { Icon, } = require('react-native-icons');


class Introduction extends Component {

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.imagewrap}>
					<Image
						style={styles.logo}
						resizeMode="contain"
						source={require('image!who_logo')}/>
				</View>

				<Text style={styles.text}>
					respondent login here?
				</Text>

				<Icon
				  name='ion|beer'
				  size={32}
				  color='#F90'
				  style={styles.beer}/>

			</View>
		);
	}
}

module.exports = Introduction;

// Local styles
var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
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
