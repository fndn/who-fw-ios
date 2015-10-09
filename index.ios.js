var React         	= require('react-native');
var {
	AppRegistry,
	StyleSheet,
	Text,
	View
} = React;

var Introduction  	= require('./Components/Introduction');
var Registrations 	= require('./Components/Registrations');
var Sync          	= require('./Components/Sync');

var GlobalStyles 	= require('./Styles/GlobalStyles');
var { TabBarIOS, } 	= require('react-native-icons');
var TabBarItemIOS 	= TabBarIOS.Item;

var t             	= require('tcomb-form-native');
var Form 			= t.form.Form;
Form.i18n 			= {optional: '', required: ' *' };
Form.stylesheet 	= GlobalStyles.formStyle;

console.log('----------------------------------------------------------------------------------------------------------------');
var Datastore 		= require('fndn-rn-datastore');


Datastore.opts({
	data: {
		database: 	'fwa-151009',
		tables: 	["countries", "locations", "brands", "incomeTypes", "storeTypes", "storeBrands", "ageGroups", "products", "currencies"],
		uploadOnly: ["register"],
		localOnly:	["registrations", "credentials"]
	},
	net: {
		remotehost: 'http://127.0.0.1:8090',
		//remotehost: 'http://172.20.10.13:8090',		// kanda ipad
		//remotehost: 'http://10.0.1.2:8090',			// base.io
		//remotehost: 'http://whofw.fndn.dk:8080',	
		remotehost: 'https://whofw.fndn.dk',
		auth_token: 'fr9a7as792jjd0293hddxonxo0x1309210cpdshcpihvq0823t373e4463'
	}
});


var fwa = React.createClass({

	getInitialState: function() {

		var self = this;

		Datastore.data.init(function(){
			console.log('@ Index data.init.cb');

			Datastore.info();
			Datastore.reach.enable();

			//console.log("X registrations:", Datastore.data.empty("registrations") );

			Datastore.M.credentials = Datastore.data.removeIDs( Datastore.data.last("credentials") );
			
			/// Badge
			Datastore.data.subscribe( "registrations", function(data){
				self.setState({regs: Datastore.data.countWhereNo("registrations", "uploaded")});
			});
			self.setState({regs: Datastore.data.countWhereNo("registrations", "uploaded")});

			console.log("All products:", Datastore.data.all("products") );
			console.log("All registrations:", Datastore.data.all("registrations") );

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

AppRegistry.registerComponent('fwa', () => fwa);
React.StatusBarIOS.setStyle(1, true); // use white statusbar ("light-content")