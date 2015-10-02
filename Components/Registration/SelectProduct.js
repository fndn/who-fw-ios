/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React           	= require('react-native');
var Datastore 			= require('fndn-rn-datastore');
var GlobalStyles    	= require('../../Styles/GlobalStyles');
var ValidateProduct 	= require('./ValidateProduct');
var Models          	= require('../Models');

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

    changed: function(r1, r2)
    {
        // In order to force redrawing registered rows, we need this comparison as r1 and r2 are the same
        if(Datastore.M.locationRegistrations)
            return Datastore.M.locationRegistrations.indexOf(r2.hash) > -1;
        else
            return r1 !== r2;
    },

	componentWillMount: function() {
		var dataSource = new ListView.DataSource({rowHasChanged: this.changed});

        this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		};

        Datastore.M.SelectProductRoute = this.props.route;
		navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
			console.log("[SelectProduct] willfocus", event.data.route.displayName);
			if(event.data.route.displayName === "SelectProduct"){

				//TODO: Filter by what?
				//Datastore.data.where('products', {"": Datastore.M. }, this.dataAvailable);
				Datastore.data.where('products', {"country": Datastore.M.country.name}, this.dataAvailable);
			}
		});
        console.log(Datastore.M.country.name);
		Datastore.data.where('products', {"country": Datastore.M.country.name}, this.dataAvailable);
	},
	
	componentWillUnmount: function() {
		navigatorEventListener.remove();
	},


	dataAvailable: function(_data){
		//console.log('[SelectProduct] dataAvailable', _data);
        // Add property "registered" to force redraw of newly registered row.

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(_data)
		});
	},

	render: function() {
		return (

			<View style={GlobalStyles.scrollViewContainer}>

				<View style={GlobalStyles.info_view_wrap}>
					<Text style={GlobalStyles.info_view_text}>These Products are available in {Datastore.M.location.country}:</Text>
				</View>

				<ListView
					style={GlobalStyles.list}
					automaticallyAdjustContentInsets={false}
					dataSource={this.state.dataSource}
					renderRow={this._renderRowWithImage}/>
			</View>
		);

	},

	_renderRowWithImage: function(rowData, sectionID, rowID) {
        // test: Read image from Documents folder

        //var _foodType = Models.foodTypes.meta.map[rowData.foodType];
        //var _ageGroup = Models.ageGroups.meta.map[rowData.ageGroup];
        //console.log("LOCATION REGISTRATIONS: ", Datastore.M.locationRegistrations, rowData.hash);
        if (Datastore.M.locationRegistrations && Datastore.M.locationRegistrations.indexOf(rowData.hash) > -1) // registered for this location
        {
            return (
                <View style={{opacity: 0.5}}>
                    <View style={GlobalStyles.listrowContainer01}>
                        <View style={GlobalStyles.listrowContainer02}>

                            <Image style={GlobalStyles.rowImage}
                                   source={{ uri: Datastore.ws.img("products", rowData.uuid, 'front', '300x300') }}/>
                            {/*<Image style={GlobalStyles.rowImage} source={{ uri: 'http://lorempixel.com/100/100/sports/'}} /> */}

                            <View>
                                <Text style={GlobalStyles.listrowTitle}>{rowData.name}</Text>
                                <Text
                                    style={GlobalStyles.listrowSubtitle}>{rowData.foodType + '\n'}by {rowData.brand + '\n'}from
                                    age {rowData.ageGroup}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={GlobalStyles.listrowSeparator}/>
                </View>
            );
        }
        else
        {
            return(
                <TouchableHighlight underlayColor='#EEE' onPress={() => this.rowPressed(rowData)}>
                    <View>
                        <View style={GlobalStyles.listrowContainer01}>
                            <View style={GlobalStyles.listrowContainer02}>

                                <Image style={GlobalStyles.rowImage}
                                       source={{ uri: Datastore.ws.img("products", rowData.uuid, 'front', '300x300') }}/>
                                {/*<Image style={GlobalStyles.rowImage} source={{ uri: 'http://lorempixel.com/100/100/sports/'}} /> */}

                                <View>
                                    <Text style={GlobalStyles.listrowTitle}>{rowData.name}</Text>
                                    <Text
                                        style={GlobalStyles.listrowSubtitle}>{rowData.foodType + '\n'}by {rowData.brand + '\n'}from
                                        age {rowData.ageGroup}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={GlobalStyles.listrowSeparator}/>
                    </View>
                </TouchableHighlight>
            );
        }
	},

	rowPressed: function(rowData) {
        console.log("= [SelectProduct] ", rowData.name);

		Datastore.M.product = rowData;
		this.props.navigator.push({
			leftButtonTitle: 'Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Validate Product',
			displayName: 'ValidateProduct',
			component: ValidateProduct

		 });
	}
});

module.exports = SelectProduct;

//module.exports.FetchData = this.fetchData();

// Local styles
var styles = StyleSheet.create({

});
