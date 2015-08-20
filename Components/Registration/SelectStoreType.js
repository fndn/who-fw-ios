/**
 * Created by JacobMac on 19/08/15.
 */

'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectBrand 		= require('./SelectBrand');
var RegisterBrand    = require('./RegisterBrand');
var SelectStoreType = React.createClass ({

    componentWillMount: function(){

        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"] });
        this.state = {
            isLoading: false,
            message: 'init',
            dataSource: dataSource
        }
    },

    componentDidMount: function(){
        console.log("SelectStoreType:: componentDidMount");
        this.fetchData();
    },

    render: function(){

        return (

            <View style={styles.container}>

                <ListView
                    automaticallyAdjustContentInsets={true}
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
                            <Text style={GlobalStyles.listrowSubtitle}>Some subtitle</Text>
                        </View>
                    </View>
                    <View style={GlobalStyles.listrowSeparator} />
                </View>
            </TouchableHighlight>
        );
    },


    rowPressed: function( rowData ){
        console.log("clicked ", rowData );
        Datastore.Session.Set('storeType', rowData);

        this.props.navigator.push({
            leftButtonTitle: '< Back',
            onLeftButtonPress: () => this.props.navigator.pop(),
            title: 'Select Brand',
            component: SelectBrand,
            onRightButtonPress: () => {
                this.props.navigator.push({
                    title: 'Register Brand',
                    component: RegisterBrand,
                    leftButtonTitle: 'Cancel',
                    onLeftButtonPress: () => { this.props.navigator.pop();}
                });
            },
            rightButtonTitle: 'Add'
            //passProps: {countryId: rowData._id, countryName: rowData.name },

        });
    },

    fetchData: function(){

        console.log("SelectStoreType:: fetchData");

        //var self = this;
        //Datastore.init(function(){
        var _data = Datastore.all('storeTypes');
        //console.log("DATA:");
        //console.log(_data);
        if( _data != null &&  _data.length > 0 ){
            this.setState({
                isLoading:false,
                message:'loaded',
                dataSource: this.state.dataSource.cloneWithRows(_data)
            });
        }
        //});


        /*
         this.setState({ isLoading: true });

         var query = Network.API + "/v1/category/list" + Network.TOKEN;
         fetch(query)
         .then((response) => response.json())
         .then((responseData) => {
         this.setState({
         isLoading:false,
         message:'loaded',
         //categories: responseData.categories
         dataSource: this.state.dataSource.cloneWithRows(responseData.categories),
         });
         console.log('Network onComplete()', responseData, this.state.dataSource);
         })
         .catch( error => {
         var msg = error.message ? error.message : error;
         this.setState({
         isLoading: false,
         message: 'Network Error:\n('+ msg +')'
         })
         })
         .done()
         */
    }

});

var Datastore  		= require('../Datastore');

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
var first = true;

module.exports = SelectStoreType;

// Local styles
var styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 0,
        flexDirection: 'column'
    },

    list: {
        flex:1
    }
});
