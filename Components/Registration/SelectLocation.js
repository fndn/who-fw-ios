'use strict';

var React = require('react-native');
var GlobalStyles = require('../../Styles/GlobalStyles');
//var SelectArea 		= require('./SelectArea');
var Datastore = require('../Datastore');

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
class SelectArea extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"]});
        this.state = {
            isLoading: false,
            message: 'init',
            dataSource: dataSource
        };
    }

    render() {

        return (

            <View style={styles.container}>

                <ListView
                    automaticallyAdjustContentInsets={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}/>
            </View>
        );

    }

    _renderRow(rowData, sectionID, rowID) {
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
                    <View style={GlobalStyles.listrowSeparator}/>
                </View>
            </TouchableHighlight>
        );
    }

    rowPressed(rowData) {
        console.log("clicked ", rowData);
        this.props.navigator.push({
            leftButtonTitle: '< Back',
            onLeftButtonPress: () => this.props.navigator.pop(),
            title: 'Select Area',
            component: SelectArea,
            passProps: {id: rowData._id, name: rowData.name}

        });
    }

    // This currently functions as a "Update once" function to fetch new data
    shouldComponentUpdate(prevProps, prevState) {
        this.fetchData();
        return (prevState.dataSource != this.state.dataSource)
    }

    /*onCameInFocus()
     {
     console.log("CAME IN FOCUS");
     }*/

    componentDidMount() {
        console.log("SelectArea:: componentDidMount");
        console.log("SelectArea:: selected country was " + this.props.countryName);
        this.fetchData();
    }

    fetchData() {

        console.log("SelectArea:: fetchData");

        //var self = this;
        //Datastore.init(function(){
        var _data = Datastore.all('locations');
        console.log("DATA:");
        console.log(_data);
        if (_data != null && _data.length > 0) {
            this.setState({
                isLoading: false,
                message: 'loaded',
                dataSource: this.state.dataSource.cloneWithRows(_data)
            });
            this.forceUpdate(); // Make sure we skip "shouldComponentUpdate" after fetching data
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

}

module.exports = SelectArea;

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