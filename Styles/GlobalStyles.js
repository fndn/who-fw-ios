'use strict';

var React = require('react-native');

var styles = React.StyleSheet.create({



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




	/**/

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

	container: {
		backgroundColor: '#F23056',
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

    scrollViewList:{
        padding: 20
    }

});



module.exports = styles;