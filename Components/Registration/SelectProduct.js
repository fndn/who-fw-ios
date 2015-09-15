/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React           = require('react-native');
var GlobalStyles    = require('../../Styles/GlobalStyles');
var Datastore       = require('../Datastore');
var ValidateProduct = require('./ValidateProduct');
var Models          = require('../Models');

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
var SelectProduct = React.createClass ({

	componentWillMount: function() {

		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"]});
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};

		// the try is only here so we CAN mount the component in index.ios.js. Remove for PRODUCTION
		try{
			// Called when select country will be focused next
			navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
				if(event.data.route.component.displayName === "SelectProduct"){
					Datastore.all('products', this.dataAvailable);
				}
			});
		}catch(e){

		}
	},


	componentDidMount: function() {
		Datastore.all('products', this.dataAvailable);
	},

	dataAvailable: function(_data){
		console.log('SelectProduct dataAvailable', _data);
		this.setState({
			isLoading:false,
			message:'loaded',
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	componentWillUnmount: function()
	{
		navigatorEventListener.remove();
	},

	render: function() {

		return (

			<View style={GlobalStyles.scrollViewContainer}>

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
		/*
		 console.log('renderRow', rowData, sectionID, rowID);
		 console.log('renderRow', Object.keys(rowData)) ;
		 console.log('renderRow', rowData["_id"]) ;
		 console.log('renderRow', rowData._id) ;
		 */

		 // test: Read image from Documents folder

		var _foodType = Models.foodTypes.meta.map[rowData.foodType];
		var _ageGroup = Models.ageGroups.meta.map[rowData.ageGroup];

		return (
			<TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
				<View>
					<View style={GlobalStyles.listrowContainer01}>
						<View style={GlobalStyles.listrowContainer02}>
							<Image style={GlobalStyles.rowImage} source={{ uri: 'http://lorempixel.com/100/100/sports/'}} />
							<View>
								<Text style={GlobalStyles.listrowTitle}>{rowData.name}</Text>
								<Text style={GlobalStyles.listrowSubtitle}>{_foodType} by {Datastore.one('brands', rowData.brand).name}, from age {_ageGroup}</Text>
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
							<Text style={GlobalStyles.listrowSubtitle}>{_foodType} by {Datastore.one('brands', rowData.brand).name}, from age {_ageGroup}</Text>
						</View>
					</View>
					<View style={GlobalStyles.listrowSeparator}/>
				</View>
			</TouchableHighlight>
		);
	},*/
	rowPressed: function(rowData) {
		console.log("= [SelectProduct] ", rowData.name);
		//Datastore.Session.Set('brand', rowData);
		Datastore.MemoryStore.product = rowData;
		this.props.navigator.push({
		 leftButtonTitle: 'Back',
		 onLeftButtonPress: () => this.props.navigator.pop(),
		 title: 'Validate Product',
		 component: ValidateProduct

		 });
	},

	// Maybe use this to make diff?? it returns the values that are different on a compared to b
	diff: function(a,b) {
		var r = {};
		_.each(a, function(v,k) {
			if(b[k] === v) return;
			// but what if it returns an empty object? still attach?
			r[k] = _.isObject(v)
				? _.diff(v, b[k])
				: v
			;
		});
		return r;
	}

});

module.exports = SelectProduct;

//module.exports.FetchData = this.fetchData();

// Local styles
var styles = StyleSheet.create({

});
