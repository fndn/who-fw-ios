'use strict';

var React           	= require('react-native');
var Datastore 			= require('fndn-rn-datastore');

var GlobalStyles    	= require('../../Styles/GlobalStyles');
var ViewRegistrations 	= require('./ViewRegistrations');
var SelectProduct 		= require('./SelectProduct');
var RegisterProduct 	= require('./RegisterProduct');

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
var isSubscribedToSync = false;

var SelectLocation = React.createClass ({

	componentWillMount: function() {

		console.log('[SelectLocation] componentWillMount');
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"]});
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};

        // Subscribe for sync event
        // Since we have no way of unsubscribing we have to check whether the component has been unmounted
        // because we only want a single subscription
        if(!isSubscribedToSync) {
            var self = this;
            Datastore.data.subscribe("registrations", function (data) {
                if (Datastore.M.country)
                    Datastore.data.where('locations', {"countryCode": Datastore.M.country.countryCode}, self.dataAvailable);
            });
            isSubscribedToSync = true;
        }

        Datastore.M.SelectLocationRoute = this.props.route;

		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
			console.log("[SelectLocation] willfocus ", event.data.route.displayName);
			if(event.data.route.displayName === "SelectLocation"){
				// (Re)load all locations filtered by countryCode
				Datastore.data.where('locations', {"countryCode": Datastore.M.country.countryCode }, this.dataAvailable);
			}
		});

		// Load all locations filtered by countryCode
		Datastore.data.where('locations', {"countryCode": Datastore.M.country.countryCode }, this.dataAvailable);
		//Datastore.data.where('locations', {"country": Datastore.M.country.name }, this.dataAvailable);
	},
	
	componentWillUnmount: function(){
		navigatorEventListener.remove();
	},

	dataAvailable: function(_data){
        Datastore.M.location = null;
		this.setState({
			isLoading:false,
			message:'loaded',
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	render: function() {
		return (
			<View style={GlobalStyles.scrollViewContainer}>

				<View style={GlobalStyles.info_view_wrap}>
					<Text style={GlobalStyles.info_view_text}>Create or Select a Location</Text>
				</View>

				<ListView
					style={GlobalStyles.list}
					automaticallyAdjustContentInsets={false}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow}/>
			</View>
		);
	},

	_renderRow: function(rowData, sectionID, rowID) {

		var subtext = "";
		subtext += rowData.street + ", " + rowData.city;
		
		if( rowData.neighbourhood ){
			subtext += ", " + rowData.neighbourhood;
		}

		return (
			<TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
				<View>
					<View style={GlobalStyles.listrowContainer}>
						<View>
							<Text style={GlobalStyles.listrowTitle}>{rowData.storeBrand}</Text>
							<Text style={GlobalStyles.listrowSubtitle}>{subtext}</Text>
						</View>
					</View>
					<View style={GlobalStyles.listrowSeparator}/>
				</View>
			</TouchableHighlight>
		);
	},

	rowPressed: function(rowData) {
		console.log("= [SelectLocation] ", rowData);
		
		//Datastore.M.location = Datastore.data.removeIDs( rowData ); // ideally we should not have _id's in the stores - as these will not match between clients
		Datastore.M.location = rowData;

		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Registrations',
			component: ViewRegistrations,
			displayName: 'ViewRegistrations',
			rightButtonTitle: 'Add',
			onRightButtonPress: () => {
				this.props.navigator.push({
					title: 'Select Product',
					component: SelectProduct,
					displayName: 'SelectProduct',
					leftButtonTitle: 'Cancel',
					onLeftButtonPress: () => { this.props.navigator.pop();},
					rightButtonTitle: 'New',
					onRightButtonPress: () =>
					{
						this.props.navigator.push({
							title: 'Register Product',
							component: RegisterProduct,
							displayName: 'RegisterProduct',
							leftButtonTitle: 'Cancel',
							onLeftButtonPress: () => {this.props.navigator.pop()}
						})
					}
				});
			}
		});
	}

});

module.exports = SelectLocation;


