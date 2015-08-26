'use strict';

var React = require('react-native');

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
		padding: 10
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

    /*
    SCROLL VIEW
    used for registrations
    * */

    scrollViewList:{
        padding: 20
    },

    scrollViewContainer:{
        flex: 1,
        marginTop: 63,
        marginBottom: 48,
        flexDirection: 'column',
        //borderColor: "#f00",
        //borderWidth: 1

    },

    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
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
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 2
    },
    imageText:{
        fontSize: 18,
        color: 'black',
        alignSelf: 'center'
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
var FONT_WEIGHT = '500';

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
            marginBottom: 4
        },
        // the style applied when a validation error occours
        error: {
            color: INPUT_COLOR,
            marginBottom: 4
        }
    },
    select: {
        normal: {
            marginBottom: 4
        },
        // the style applied when a validation error occours
        error: {
            marginBottom: 4
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


module.exports = styles;
module.exports.colors = colors;
module.exports.formStyle = formStyleSheet;