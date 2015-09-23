'use strict';

var React = require('react-native');

var { View, Text, TextInput, SwitchIOS, PickerIOS, DatePickerIOS } = React;

var styles = React.StyleSheet.create({

	container: {
		backgroundColor: 'white',
		alignItems: 'center'
	},

	/*
	LISTS
	used for select lists
	*/
	list:{
		flex: 1
	},

	listrowContainer: {
		flexDirection: 'row',
		padding: 10,
	},

	listrowTitle: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold'
	},

	listrowSubtitle: {
		flex: 1,
		fontSize: 14,
		color: "#666",
		paddingTop: 6
	},

	listrowSeparator: {
		height: 1,
		backgroundColor: '#D8D8D8'
	},

	/**/
	listrowContainer01: {
		flexDirection: 'row',
		padding: 10,
		alignItems: 'flex-start',
	},
	listrowContainer02: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		overflow: 'hidden',
		width: 300
	},
	rowImage: {
		width: 50,
		height: 50,
		marginRight: 10,
		backgroundColor: '#D8D8D8'
	},

	/*
	SCROLL VIEW
	used for registrations
	*/

	scrollViewList:{
		padding: 20,
	},

	scrollViewContainer:{
		flex: 1,
		marginTop: 63,
		marginBottom: 48,
		flexDirection: 'column',
		//borderColor: "#f00",
		//borderWidth: 1
		//backgroundColor: '#f00'
	},

	/*
	title: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 30
	},
	*/
	title: {
		fontSize: 19,
		marginTop: 40,
		marginBottom: 20,
		fontWeight: '500',
	},

	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},

	/*
	IMAGES
	used for registrations
	 */

	imageGrid: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		width: 300,
	},
	image: {
		width: 100,
		height: 100,
		margin: 10,
		borderColor: '#555',
		borderWidth: 1,
		borderRadius: 0
	},
	imageText:{
		fontFamily: 'HelveticaNeue-Medium',
		fontSize: 15,
		marginTop: 50,
	},



	/* UNUSED ?? */

	container_fs: {
		flex: 1
	},

	container_fs_center: {
		padding: 30,
		marginTop: 65,
		alignItems: 'center'
	},

	textContainer: {
		flex: 1
	},

	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},

	separator: {
		height: 1,
		backgroundColor: '#D82144'
	},

	txt_msg: {

	},

	txt_list_lrg: {
		fontSize: 17,
		color: '#fff',
		fontFamily:'HelveticaNeue',
		fontWeight: '500',
	},
	txt_list_med: {
		fontSize: 15,
		fontFamily:'HelveticaNeue',
		fontWeight: '500',
		color: '#fff'
	},
	txt_list_sml: {
		fontSize: 13,
		fontFamily:'HelveticaNeue',
		color: '#941931'
	},
	txt_list_sml_light: {
		fontSize: 13,
		fontFamily:'HelveticaNeue',
		color: '#fff'
	},

	txt_list_med_bold: {
		fontSize: 16,
		color: '#fff',
		fontWeight: 'bold'
	},

	/// info_view
	/// (Sits below the Navigator)
	info_view_wrap: {
		backgroundColor: '#98C8F9',
		justifyContent: 'center',
		padding:10,
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(0,0,0,0.2)',
	},

	info_view_text:{
		color: '#04083F',
	}



});


var colors = {
	formHighlightColor: '#99d9f4'
};


/* THIS IS FOR styling tcomb-forms */
// currently just copied lib/stylesheets/bootstrap

var LABEL_COLOR = '#000000';
var INPUT_COLOR = '#000000';
var ERROR_COLOR = '#a94442';
var HELP_COLOR = '#999999';
var BORDER_COLOR = '#cccccc';
var DISABLED_COLOR = '#777777';
var DISABLED_BACKGROUND_COLOR = '#eeeeee';
var FONT_SIZE = 17;
var FONT_WEIGHT = '400';

var formStyleSheet = {
	fieldset: {},
	// the style applied to the container of all inputs
	formGroup: {
		normal: {
			marginBottom: 10
		},
		error: {
			marginBottom: 10
		}
	},
	controlLabel: {
		normal: {
			color: LABEL_COLOR,
			fontSize: FONT_SIZE,
			marginBottom: 7,
			fontWeight: FONT_WEIGHT
		},
		// the style applied when a validation error occours
		error: {
			color: ERROR_COLOR,
			fontSize: FONT_SIZE,
			marginBottom: 7,
			fontWeight: FONT_WEIGHT
		}
	},
	helpBlock: {
		normal: {
			color: HELP_COLOR,
			fontSize: FONT_SIZE,
			marginBottom: 2
		},
		// the style applied when a validation error occours
		error: {
			color: HELP_COLOR,
			fontSize: FONT_SIZE,
			marginBottom: 2
		}
	},
	errorBlock: {
		fontSize: FONT_SIZE,
		marginBottom: 2,
		color: ERROR_COLOR
	},
	textbox: {
		normal: {
			color: INPUT_COLOR,
			fontSize: FONT_SIZE,
			height: 36,
			padding: 7,
			borderRadius: 4,
			borderColor: BORDER_COLOR,
			borderWidth: 1,
			marginBottom: 5
		},
		// the style applied when a validation error occours
		error: {
			color: INPUT_COLOR,
			fontSize: FONT_SIZE,
			height: 36,
			padding: 7,
			borderRadius: 4,
			borderColor: ERROR_COLOR,
			borderWidth: 1,
			marginBottom: 5
		},
		// the style applied when the textbox is not editable
		notEditable: {
			fontSize: FONT_SIZE,
			height: 36,
			padding: 7,
			borderRadius: 4,
			borderColor: BORDER_COLOR,
			borderWidth: 1,
			marginBottom: 5,
			color: DISABLED_COLOR,
			backgroundColor: DISABLED_BACKGROUND_COLOR
		}
	},
	checkbox: {
		normal: {
			color: INPUT_COLOR,
			marginBottom: 4,
		},
		// the style applied when a validation error occours
		error: {
			color: INPUT_COLOR,
			marginBottom: 4
		}
	},
	select: {
		normal: {
			marginBottom: 4,
			backgroundColor: '#F8F8F8',
			paddingLeft: 20,
			paddingRight: 20,
		},
		// the style applied when a validation error occours
		error: {
			marginBottom: 4,
			backgroundColor: '#F8F8F8',
			paddingLeft: 20,
			paddingRight: 20,
		}
	},
	datepicker: {
		normal: {
			marginBottom: 4

		},
		// the style applied when a validation error occours
		error: {
			marginBottom: 4
		}
	}
};

//var theme = {};
var theme = require('./theme.UNBlue.js');
//styles = mergeObjects(styles, theme);
//console.log('themed styles', styles );

module.exports = styles;
module.exports.theme = theme;

module.exports.colors = colors;
module.exports.formStyle = formStyleSheet;

module.exports.indentedBool = function (locals) {
	var stylesheet = locals.stylesheet;
	var formGroupStyle = {marginTop:10, marginLeft:20};
	var controlLabelStyle = stylesheet.controlLabel.normal;
	var checkboxStyle = stylesheet.checkbox.normal;
	var helpBlockStyle = stylesheet.helpBlock.normal;
	var errorBlockStyle = stylesheet.errorBlock;

	if (locals.hasError) {
		formGroupStyle = stylesheet.formGroup.error;
		controlLabelStyle = stylesheet.controlLabel.error;
		checkboxStyle = stylesheet.checkbox.error;
		helpBlockStyle = stylesheet.helpBlock.error;
	}

	var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
	var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
	var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

	return (
		<View style={formGroupStyle}>
			{label}
			<SwitchIOS
				ref="input"
				disabled={locals.disabled}
				onTintColor={locals.onTintColor}
				thumbTintColor={locals.thumbTintColor}
				tintColor={locals.tintColor}
				style={checkboxStyle}
				onValueChange={(value) => locals.onChange(value)}
				value={locals.value}
				/>
			{help}
			{error}
		</View>
	);
};

module.exports.indentedTextbox = function(locals) {

	var stylesheet = locals.stylesheet;
	var formGroupStyle = {marginTop:10, marginLeft:20};
	var controlLabelStyle = stylesheet.controlLabel.normal;
	var textboxStyle = stylesheet.textbox.normal;
	var helpBlockStyle = stylesheet.helpBlock.normal;
	var errorBlockStyle = stylesheet.errorBlock;

	if (locals.hasError) {
		formGroupStyle = stylesheet.formGroup.error;
		controlLabelStyle = stylesheet.controlLabel.error;
		textboxStyle = stylesheet.textbox.error;
		helpBlockStyle = stylesheet.helpBlock.error;
	}

	if (locals.editable === false) {
		textboxStyle = stylesheet.textbox.notEditable;
	}

	var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
	var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
	var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

	return (
		<View style={formGroupStyle}>
			{label}
			<TextInput
				ref="input"
				autoCapitalize={locals.autoCapitalize}
				autoCorrect={locals.autoCorrect}
				autoFocus={locals.autoFocus}
				bufferDelay={locals.bufferDelay}
				clearButtonMode={locals.clearButtonMode}
				editable={locals.editable}
				enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
				keyboardType={locals.keyboardType}
				multiline={locals.multiline}
				onBlur={locals.onBlur}
				onEndEditing={locals.onEndEditing}
				onFocus={locals.onFocus}
				onSubmitEditing={locals.onSubmitEditing}
				password={locals.password}
				placeholderTextColor={locals.placeholderTextColor}
				returnKeyType={locals.returnKeyType}
				selectTextOnFocus={locals.selectTextOnFocus}
				secureTextEntry={locals.secureTextEntry}
				selectionState={locals.selectionState}
				onChangeText={(value) => locals.onChange(value)}
				placeholder={locals.placeholder}
				style={textboxStyle}
				value={locals.value}
				/>
			{help}
			{error}
		</View>
	);
};

/*
function mergeObjects(base, curry){
	var bkeys = Object.keys(base);
	console.log('#0 curry:', Object.keys(curry), curry['scrollViewContainer'] );
	console.log('#0 base: ', bkeys );
	Object.keys(curry).forEach( function(ck){
		console.log('#1 ', ck);
		if( bkeys.indexOf(ck) > -1 ){
			console.log('#2 found $ck', ck, " at bkeys.pos:", bkeys.indexOf(ck) );
			console.log('#2 ', curry[ck]);
			console.log('#2 ', Object.keys(curry[ck]));

			Object.keys(curry[ck]).forEach( function(cck){
				//base[ck][cck] = curry[ck][cck];
				console.log('setting base[ck][cck]:', base[ck][cck] , " to curry[ck][cck]:", curry[ck][cck] );
			});
		}
	});
	return base;
}
*/