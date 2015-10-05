/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React           = require('react-native');
var GlobalStyles    = require('../../Styles/GlobalStyles');
var D 		        = require('fndn-rn-datastore');
var SelectProduct 	= require('./SelectProduct');
var Models          = require('../Models');
var ObjectEquals 	= require('../../node_modules/fndn-rn-datastore/lib/object.compare.js');

var {
	StyleSheet,
	View,
	Text,
	Image,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS,
	ListView
	} = React;

var navigatorEventListener;
var productNames = {};
var locationRegistrations = [];

var ViewRegistrations = React.createClass ({

	componentWillMount: function() {

		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"]});
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};
        // Reset current registrations
        locationRegistrations = [];
        D.M.locationRegistrations = null;

        D.M.ViewRegistrationsRoute = this.props.route;

		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
			//console.log("[ViewRegistrations]", event.data.route);
			if(event.data.route.displayName === "ViewRegistrations"){
				//D.data.where("registrations", {locationID: D.M.location._id} , this.dataAvailable);
				D.data.where('registrations', {locationID:D.M.location.hash}, this.dataAvailable);
				//console.log("***** 2 ***** all registrations", D.data.all('registrations'));
			}
		});
		
		//console.log("***** H1 ***** all registrations", D.data.all('registrations'));
		//console.log("***** H2 ***** all registrations", D.data.where('registrations', {locationID:D.M.location.hash}, this.dataAvailable));

		//D.data.where("registrations", {locationID: D.M.location._id} , this.dataAvailable);
		D.data.where('registrations', {locationID:D.M.location.hash}, this.dataAvailable);

	},

	dataAvailable: function(_data){
        console.log("REGISTRATIONS ", _data);
		this.setState({
			isLoading:false,
			message:'loaded',
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	componentWillUnmount: function(){
		navigatorEventListener.remove();
	},

	render: function() {

		return (

			<View style={GlobalStyles.scrollViewContainer}>

				<View style={GlobalStyles.info_view_wrap}>
					<Text style={GlobalStyles.info_view_text}>These Products have been Registered:{"\n"}(and can not be edited)</Text>
				</View>

				<ListView
					style={GlobalStyles.list}
					automaticallyAdjustContentInsets={false}
					dataSource={this.state.dataSource}
					renderRow={this._renderRowWithImage}/>
			</View>
		);

	},


	// dev:

	_renderRowWithImage: function(rowData, sectionID, rowID) {
		var productInfo = rowData.product;

		
		/*
		/// resolve image
		console.log('_renderRowWithImage', rowData);
		var image = (<Image style={GlobalStyles.rowImage} source={{ uri: D.ws.img("products", productInfo.uuid, 'front', '300x300') }} />);
		if( ! rowData.hasImages ){
			/// see if we registered this record locally
			var d = D.data.one("registrations", {hash:rowData.hash})
			//console.log(' > ONE', d );

			var PP = D.data.one("products", {uuid:productInfo.uuid})
			console.log(' > ONE PP', PP );


			if( d.product.imgstore ){
				console.log('**** this record can use Registration images');
				var filename = d.product.imgstore[0].path.split("Documents/").slice(-1);
				image = (<Image style={GlobalStyles.rowImage} source={{ uri: D.ws.raw(filename) }} />);
			}
		}
		*/

        locationRegistrations.push(productInfo.hash);
        D.M.locationRegistrations = locationRegistrations;
		return (
			<TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
				<View>
					<View style={GlobalStyles.listrowContainer01}>
						<View style={GlobalStyles.listrowContainer02}>
							<Image style={GlobalStyles.rowImage} source={{ uri: D.ws.img("products", productInfo.uuid, 'front', '300x300') }} />
							<View>
								<Text style={GlobalStyles.listrowTitle}>{productInfo.name}</Text>
								<Text style={GlobalStyles.listrowSubtitle}>{productInfo.foodType} by {productInfo.brand}, from age {productInfo.ageGroup}</Text>
							</View>
						</View>
					</View>
					<View style={GlobalStyles.listrowSeparator}/>
				</View>
			</TouchableHighlight>
		);
	},


	/*_renderRow: function(rowData, sectionID, rowID) {

		var _foodType = Models.foodTypes.meta.map[rowData.foodType];
		var _ageGroup = Models.ageGroups.meta.map[rowData.ageGroup];


		return (
			<TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
				<View>
					<View style={GlobalStyles.listrowContainer}>
						<View>
							<Text style={GlobalStyles.listrowTitle}>{rowData.name}</Text>
							<Text style={GlobalStyles.listrowSubtitle}>{_foodType} by {rowData.brand}, from age {_ageGroup}</Text>
						</View>
					</View>
					<View style={GlobalStyles.listrowSeparator}/>
				</View>
			</TouchableHighlight>
		);
	},*/
	rowPressed: function(rowData) {
		console.log("= [ViewRegistrations] ", rowData.product.name);
		//D.Session.Set('brand', rowData);
		/*D.M.product = rowData;
		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Validate Product',
			component: ValidateProduct

		});*/
	}

});

module.exports = ViewRegistrations;

//module.exports.FetchData = this.fetchData();

// Local styles
var styles = StyleSheet.create({
	rowImageSelected: {
		position: 'absolute',
		width: 16,
		height: 16,
		left: 50 - 16 - 1,
		top: 1,
		marginRight: 0,
	},
});
