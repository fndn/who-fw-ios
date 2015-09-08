'use strict';

var React 				= require('react-native');
var GlobalStyles 		= require('../../Styles/GlobalStyles');
var SelectLocation 		= require('./SelectLocation');
var RegisterLocation    = require('./RegisterLocation');
var Datastore  			= require('../Datastore');

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

	getInitialState: function() {
		//console.log('SelectCountry getInitialState');
		return null;
	},

	componentWillMount: function(){
		//console.log('SelectCountry componentWillMount');
		//super(props);
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"] });
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};

		// Called when select country will be focused next
		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) =>
		{
			//console.log(event.data.route.component.displayName);
			if(event.data.route.component.displayName === "SelectCountry"){
				Datastore.all('countries', this.dataAvailable);
			}
			
		});

		Datastore.all('countries', this.dataAvailable);
	},

	componentDidMount: function(){
		//console.log('SelectCountry componentDidMount');
		Datastore.all('countries', this.dataAvailable);
	},

	dataAvailable: function(_data){
		//console.log('SelectCountry dataAvailable', _data);
		this.setState({
			isLoading:false,
			message:'loaded',
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	componentWillUnmount: function(){
		navigatorEventListener.remove();
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
		/*
		console.log('renderRow', rowData, sectionID, rowID);
		console.log('renderRow', Object.keys(rowData)) ;
		console.log('renderRow', rowData["_id"]) ;
		console.log('renderRow', rowData._id) ;
		*/
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
		//Datastore.Session.Set('country', rowData);
		Datastore.MemoryStore.country = rowData;

		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Select Location',
			component: SelectLocation,
			onRightButtonPress: () => {
				this.props.navigator.push({
					title: 'Register Location',
					component: RegisterLocation,
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

// Local styles
var styles = StyleSheet.create({

});
