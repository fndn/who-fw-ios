'use strict';

var React         = require('react-native');

var Introduction  = require('./Components/Introduction');
var Registrations = require('./Components/Registrations');
var Sync          = require('./Components/Sync');

var {
	AppRegistry,
	StyleSheet,
	TabBarIOS,
	Text,
	View,
} = React;


var Datastore = require('./Components/Datastore');
Datastore.init();

var FWA = React.createClass({

	getInitialState: function() {
		return {
			selectedTab: 'Introduction',
		};
	},
	
	render: function(){
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
