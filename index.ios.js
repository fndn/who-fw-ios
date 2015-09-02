'use strict';

var React         	= require('react-native');
var {
	AppRegistry,
	StyleSheet,
	//TabBarIOS,
	Text,
	View
} = React;

var { TabBarIOS, } 	= require('react-native-icons');
var TabBarItemIOS 	= TabBarIOS.Item;

var Introduction  	= require('./Components/Introduction');
var Registrations 	= require('./Components/Registrations');
var Sync          	= require('./Components/Sync');

//var SelectProduct   = require('./Components/Registration/SelectProduct');

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
introStyles.textbox.focused = {
	color: '#f',
	fontSize: 17,
	height: 36,
	padding: 7,
	borderRadius: 4,
	borderColor: '#f',
	borderWidth: 5,
	marginBottom: 5
};

introStyles.controlLabel.normal = {
	color: '#fff',
	fontSize: 17,
	marginBottom: 7,
	fontWeight: '500'
};


var Datastore = require('./Components/Datastore');
//Datastore.init(); /// moved to getInitialState() so we can utilize the callbacks

var FWA = React.createClass({

	getInitialState: function() {

		var self = this;

		Datastore.init(function(){
			//console.log('[index.ios] Datastore init CB');
			self.setState({regs: Datastore.countWhereNo("registrations", "uploaded")});
		});

		/*
		Datastore.Remote.OnReachableStateChanged( function(state){
			console.log('[index.ios] OnReachableStateChanged()');
			//console.log('[index.ios all credentials >  ', Datastore.all('credentials') );
			console.log('[index.ios last credentials > ', Datastore.last('credentials') );

			//self.setState({regs: Datastore.countWhereNo("registrations", "uploaded")});
		});
		*/
		
		Datastore.OnChange( "registrations", function(data){
			//console.log('[index.ios] Datastore registrations OnChange()', data);
			self.setState({regs: Datastore.countWhereNo("registrations", "uploaded")});
		});

		return {
			selectedTab: 'Introduction', // initial view
			regs: 0,
		};
	},
	
	render: function(){

		if( this.state.selectedTab == 'Introduction' ){
			Form.stylesheet = introStyles;
			React.StatusBarIOS.setStyle(1, false); // use white statusbar
		}else{
			Form.stylesheet = GlobalStyles.formStyle;
			React.StatusBarIOS.setStyle(0, false); // use dark statusbar 
		}

		// icons: http://ionicons.com/

		return (
			<TabBarIOS
				tintColor={'#4B92DB'}
				barTintColor={'#ffffff'}
				>
				<TabBarIOS.Item
					iconName={'ion|ios-person'}
					iconSize={40}

					title='Introduction'
					selected={this.state.selectedTab === 'Introduction'}
					onPress={() => {this.setState({ selectedTab: 'Introduction' }) }}>
					<Introduction/>
				</TabBarIOS.Item>
				
				<TabBarIOS.Item 
					iconName={'ion|pricetag'}
					iconSize={28}

					title='Registrations'
					selected={this.state.selectedTab === 'Registrations'}
					onPress={() => {this.setState({ selectedTab: 'Registrations' }) }}>
					<Registrations />
				</TabBarIOS.Item>

				<TabBarIOS.Item
					iconName={'ion|ios-cloud-upload'}
					iconSize={0}
					systemIcon="history"
					badgeValue={this.state.regs > 0 ? ''+this.state.regs : undefined}

					title='Sync'
					selected={this.state.selectedTab === 'Sync'}					
					onPress={() => {this.setState({ selectedTab: 'Sync' }) }}>
					<Sync/>
				</TabBarIOS.Item>	
							
			</TabBarIOS>		
		);
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
React.StatusBarIOS.setStyle(1, true); // use white statusbar ("light-content")
