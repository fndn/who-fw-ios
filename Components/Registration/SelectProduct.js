/**
 * Created by JacobMac on 20/08/15.
 */

'use strict';

var React = require('react-native');
var GlobalStyles = require('../../Styles/GlobalStyles');
var Datastore = require('../Datastore');
var ValidateProduct = require('./ValidateProduct');

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
var SelectProduct = React.createClass ({

    componentWillMount: function() {

        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"]});
        this.state = {
            isLoading: false,
            message: 'init',
            dataSource: dataSource
        };

        // Called when select country will be focused next
        navigatorEventListener = this.props.navigator.navigationContext.addListener('willfocus', (event) =>
        {
            if(event.data.route.component.displayName === "SelectProduct")
                Datastore.all('products', this.dataAvailable);
            //console.log(event.data.route.component.displayName);

        });
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

            <View style={styles.container}>

                <ListView
                    automaticallyAdjustContentInsets={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}/>
            </View>
        );

    },

    _renderRow: function(rowData, sectionID, rowID) {
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
                            <Text style={GlobalStyles.listrowSubtitle}>Some comment</Text>
                        </View>
                    </View>
                    <View style={GlobalStyles.listrowSeparator}/>
                </View>
            </TouchableHighlight>
        );
    },
    rowPressed: function(rowData) {
        console.log("clicked ", rowData);
        //Datastore.Session.Set('brand', rowData);
        Datastore.MemoryStore.product = rowData;
        this.props.navigator.push({
         leftButtonTitle: '< Back',
         onLeftButtonPress: () => this.props.navigator.pop(),
         title: 'Validate Product',
         component: ValidateProduct

         });
    }

});

module.exports = SelectProduct;

//module.exports.FetchData = this.fetchData();

// Local styles
var styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: 0,
        flexDirection: 'column'
    },

    list: {
        flex: 1
    }
});
