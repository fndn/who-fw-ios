'use strict';

var React 			= require('react-native');
var GlobalStyles 	= require('../../Styles/GlobalStyles');
var SelectArea 		= require('./SelectArea');

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

/*
var dummydata = [
	{"_id": 1, "name": "dk"},
	{"_id": 2, "name": "se"},
	{"_id": 3, "name": "no"},
	{"_id": 4, "name": "gb"}
];

*/
class SelectCountry extends Component {

	constructor( props ){
		super(props);
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1["_id"] !== r2["_id"] });
		this.state = {
			isLoading: false,
			message: 'init',
			dataSource: dataSource
		}
	}

	render(){

		return (
			<View style={styles.container}>
				<ListView
					dataSource  = {this.state.dataSource} 
					automaticallyAdjustContentInsets={false}
					renderRow 	= {this._renderRow.bind(this)} />
			</View>
		);
		
	}


	_renderRow( rowData, sectionID, rowID ){
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
	}

	rowPressed( rowData ){
		console.log("clicked ", rowData );
		this.props.navigator.push({
			leftButtonTitle: '< Back',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Select Area*',
			component: SelectArea,
			passProps: {id: rowData._id, name: rowData.name },

		});	
	}

	componentDidMount(){
		//console.log("SelectCountry:: componentDidMount");
		this.fetchData();
	}

	fetchData(){

		console.log("SelectCountry:: fetchData");
		var self = this;
		Datastore.init(function(){
			var _data = Datastore.all('countries');
			if( _data.length > 0 ){
				self.setState({
					isLoading:false,
					message:'loaded',
					dataSource: self.state.dataSource.cloneWithRows(_data),
				});
			}	
		});

		/*
		var _data = Datastore.Get('countries');
		if( _data.length > 0 ){
			this.setState({
				isLoading:false,
				message:'loaded',
				//categories: responseData.categories
				 dataSource: this.state.dataSource.cloneWithRows(_data),
			});
		}
		*/

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

module.exports = SelectCountry;

// Local styles
var styles = StyleSheet.create({

	container: {
		flex: 1,
		marginTop: 63,
		flexDirection: 'column'
	},

	list: {
		flex:1,
	},
});
