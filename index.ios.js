'use strict';

var React         	= require('react-native');
var {
	AppRegistry,
	StyleSheet,
	TabBarIOS,
	Text,
	View
} = React;

var Introduction  	= require('./Components/Introduction');
var Registrations 	= require('./Components/Registrations');
var Sync          	= require('./Components/Sync');

var GlobalStyles 	= require('./Styles/GlobalStyles');
var t             	= require('tcomb-form-native');
var Form = t.form.Form;

Form.i18n = {
    optional: '',
    required: ' *'
};
Form.stylesheet = GlobalStyles.formStyle;

var introStyles = JSON.parse( JSON.stringify(GlobalStyles.formStyle));
introStyles.textbox.normal = {
    color: '#fff',
    fontSize: 17,
    height: 36,
    padding: 7,
    borderRadius: 4,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 5
};

introStyles.controlLabel.normal = {
    color: '#fff',
    fontSize: 17,
    marginBottom: 7,
    fontWeight: '500'
};//


var Datastore = require('./Components/Datastore');
Datastore.init();

var FWA = React.createClass({

	getInitialState: function() {
		return {
			selectedTab: 'Introduction',
		};
	},
	
	render: function(){

		if( this.state.selectedTab == 'Introduction' ){
			Form.stylesheet = introStyles;
		}else{
			Form.stylesheet = GlobalStyles.formStyle;
		}

		return (
			<TabBarIOS>
				<TabBarIOS.Item 
					title='Introduction'
					selected={this.state.selectedTab === 'Introduction'}
					onPress={() => {this.setState({ selectedTab: 'Introduction' }) }}>

					<Introduction/>
				</TabBarIOS.Item>
				
				<TabBarIOS.Item 
					title='Registrations'
					selected={this.state.selectedTab === 'Registrations'}
					onPress={() => {this.setState({ selectedTab: 'Registrations' }) }}>
					<Registrations />
				</TabBarIOS.Item>

				<TabBarIOS.Item
					title='Sync'
					selected={this.state.selectedTab === 'Sync'}					
					onPress={() => {this.setState({ selectedTab: 'Sync' }) }}>
					<Sync/>
				</TabBarIOS.Item>								
			</TabBarIOS>		
		)

	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

AppRegistry.registerComponent('FWA', () => FWA);
//React.StatusBarIOS.setStyle(1, true); // use white statusbar ("light-content")
