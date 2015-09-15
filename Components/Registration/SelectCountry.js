'use strict';

var React 				= require('react-native');
var Datastore 			= require('fndn-rn-datastore');

var GlobalStyles 		= require('../../Styles/GlobalStyles');
var SelectLocation 		= require('./SelectLocation');
var RegisterLocation    = require('./RegisterLocation');

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	ListView
} = React;

var navigatorEventListener;

var SelectCountry = React.createClass ({

	componentWillMount: function(){
		console.log('[SelectCountry] componentWillMount');

		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"] });
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};

		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
			//console.log("[SelectCountry]", event.data.route.displayName);
			if(event.data.route.displayName === "SelectCountry"){
				Datastore.data.all('countries', this.dataAvailable);
			}			
		});

		// 1
		Datastore.data.all('countries', this.dataAvailable);
	},

	componentWillUnmount: function(){
		navigatorEventListener.remove();
	},

	/*
	componentDidMount: function(){
		console.log('[SelectCountry] componentDidMount');
		Datastore.data.all('countries', this.dataAvailable);
	},
	*/

	dataAvailable: function(_data){
		console.log('[SelectCountry] dataAvailable', _data);
		
		Datastore.data.orderBy(_data, "name"); // orders *in place*

		this.setState({
			isLoading:false,
			message:'loaded',
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	render: function(){
		return (
			<View style={[GlobalStyles.scrollViewContainer, GlobalStyles.theme.scrollViewContainer]}>
				<ListView
					style={GlobalStyles.list}
					automaticallyAdjustContentInsets={false}
					dataSource  = {this.state.dataSource}
					renderRow 	= {this._renderRow} />
			</View>
		);
	},

	_renderRow: function( rowData, sectionID, rowID ){
		return (
			<TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
				<View>
					<View style={GlobalStyles.listrowContainer}>
						<View>
							<Text style={GlobalStyles.listrowTitle}>{rowData.name}</Text>
							<Text style={GlobalStyles.listrowSubtitle}>{rowData.countryCode}</Text>
						</View>
					</View>
					<View style={GlobalStyles.listrowSeparator} />
				</View>
			</TouchableHighlight>
		);
	},

	rowPressed: function( rowData ){
		console.log("= [SelectCountry] ", rowData.name );

		Datastore.M.country = rowData;

		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Select Location',
			displayName: 'SelectLocation',
			component: SelectLocation,
			onRightButtonPress: () => {
				this.props.navigator.push({
					title: 'Register Location',
					component: RegisterLocation,
					displayName: 'RegisterLocation',
					leftButtonTitle: 'Cancel',
					onLeftButtonPress: () => { this.props.navigator.pop();}
				});
			},
			rightButtonTitle: 'Add'
			//passProps: {countryId: rowData._id, countryName: rowData.name },

		});
	}
});

module.exports = SelectCountry;

