'use strict';

var React 			        = require('react-native');
var Datastore 				= require('fndn-rn-datastore');
var t                       = require('tcomb-form-native');

var Models                  = require('../Models');
var RegisterStoreBrand      = require('./RegisterStoreBrand');
var GlobalStyles 	        = require('../../Styles/GlobalStyles');

var Form = t.form.Form;

var options = {};

var {
	StyleSheet,
	View,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	ActivityIndicatorIOS,
	NavigatorIOS,
	ScrollView
} = React;

var navigatorEventListener;

var _tmp_state = {};


var RegisterLocation = React.createClass({
	
	getInitialState: function() {
        // _tmp_state is kept in a session

        if(_tmp_state.street)
            _tmp_state.street = null;
		_tmp_state.scrollOffset = 0;

		return {
			value: _tmp_state
		};
	},

	render: function(){

		return (
			<View style={GlobalStyles.scrollViewContainer}>

				<ScrollView
					style={GlobalStyles.scrollViewList}
					automaticallyAdjustContentInsets={false}
					keyboardDismissMode={'on-drag'}
					keyboardShouldPersistTaps={false}
					scrollsToTop={true}
					contentOffset={{x:0, y:_tmp_state.scrollOffset + Math.random()}}
					onScroll={(event: Object) => {_tmp_state.scrollOffset = event.nativeEvent.contentOffset.y;}}
					scrollEventThrottle={5}>
					<Form
						ref="form"
						type={Models.Location()}
						options={options}
						value={this.state.value}
						onChange={this.onChange}/>

					<TouchableOpacity
						style={styles.addStoreBrandButton}
						onPress = {this.onAddStoreBrand}>
						<Text style={styles.buttonText}>Add</Text>
					</TouchableOpacity>

					<TouchableHighlight
						style={GlobalStyles.button}
						onPress = {this.onPress}
						underlayColor={GlobalStyles.colors.formHighlightColor}>
						<Text style={GlobalStyles.buttonText}>Save</Text>
					</TouchableHighlight>
				</ScrollView>
			</View>
		);
	},

	onAddStoreBrand: function(){
		console.log("[RegisterLocation] Add Store Brand");
		
		// store Form values in state (so the values are still there when we return)
		this.setState({value: _tmp_state});

		this.props.navigator.push({
			leftButtonTitle: 'Cancel',
			onLeftButtonPress: () => this.props.navigator.pop(),
			title: 'Register Store Brand',
			component: RegisterStoreBrand,
            callback: this.onReturnFromAdd
		});
	},

    onReturnFromAdd(id)
    {
        _tmp_state.storeBrand = Models.numberToLetters(id);
        this.setState({value: _tmp_state});
    },


	onChange: function(value){
		// store Form value outside state (hitting state is too expensive)
		_tmp_state = value;
		//this.setState({value: value});
	},

	onPress: function(){
		var value = this.refs.form.getValue();

		if( value == null ){
			var firstError = (this.refs.form.validate().errors[0].path[0]);

			this.refs.form.getComponent(firstError).refs.input.measure((ox,oy,width,height,px,py) => {
				_tmp_state.scrollOffset += (py - 110.5); // navigator height + element height, ish
				this.setState({value: _tmp_state});
			});
		}
		
		if (value) {
			var newVal = Datastore.clone(value);
			newVal.country = Datastore.M.country.name;
			newVal.countryCode = Datastore.M.country.countryCode;


			// storeBrands are stored as letters such as A = 1 C = 2 AA = 27 etc.
			// Therefore we need to convert it back to a number to retrieve from Datastore
			newVal.storeBrand = Models.letterToNumbers(newVal.storeBrand);
            // Then convert it to plain text
			newVal.storeBrand = Datastore.data.one('storeBrands', {_id:newVal.storeBrand}).name;

            // Convert IncomeType to plain text
            newVal.incomeType = Models.incomeTypes.meta.map[newVal.incomeType];
            newVal.storeType = Models.storeTypes.meta.map[newVal.storeType];
			console.log("[RegisterLocation] new location: ", newVal);

			Datastore.data.add('locations', newVal);
			this.props.navigator.pop();
		}
	}
});


// Heights:
// text field: 78.5
// picker: 257.5

var styles = StyleSheet.create({
	addStoreBrandButton:{
		position: 'absolute',
		top: 78.5 * 3 + 257.5 * 2,
		right: 0

	},
	addStoreTypeButton:{
		position: 'absolute',
		top: 78.5 * 3 + 257.5 * 1,
		right: 0

	},

	buttonText:
	{
		fontSize: 17,
		color: '#4b92db'
	}
});

module.exports = RegisterLocation;
