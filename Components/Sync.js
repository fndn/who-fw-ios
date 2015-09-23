'use strict';

var React 			= require('react-native');
var Datastore 		= require('fndn-rn-datastore');
var { Icon, } 		= require('react-native-icons');
var GlobalStyles 	= require('../Styles/GlobalStyles');
var ProgressBar 	= require('./Parts/ProgressBar');

var {
	AppRegistry,
	StyleSheet,
	View,
	ScrollView,
	Text,
	Component,
	TextInput,
	TouchableHighlight,
	ActivityIndicatorIOS
} = React;

var Sync = React.createClass({
	
	is_setup: false,

	_setup: function(){
		console.log('@ Sync _setup');
		var self = this;

		/// untested: 
		//if( !Datastore.ready ){
		//	Datastore.data.init( self._setup );
		//}else{
		//Datastore.data.init(function(){
			
			console.log('@ Sync Datastore.init.cb > ready');

			Datastore.reach.subscribe( function(state, ms){
				self.setState({
					remote_reachable:    state,
					remote_responseTime: ms
				});
			});

			Datastore.data.subscribe( "synclog", function(data){
				console.log('[Sync] Datastore synclog OnChange()', data );
				self.setState({since_lastsync_str: data.date});
			});
			var lastSync = Datastore.data.last("synclog");
			console.log('lastSync:', lastSync);
			if( lastSync != undefined ){
				self.setState({since_lastsync_str:""+ lastSync.date});
			}

			self.setState({is_setup:true});
		//});
		//}

		

	},
	
	getInitialState: function() {

		var _tables = Datastore.opts().data.tables.filter( function(el){ return Datastore.opts().data.uploadOnly.indexOf(el) == -1 });//.join(", ");
		var _last_table = _tables.pop();
		var tables_str = _tables.join(", ") + " and "+ _last_table;

		return {
			is_setup: false,
			progress_message: "idle",
			working: false,
			show_log: false,
			show_dl: false,
			show_ul: false,
			progress_dl: 0,
			progress_dlcurr: 0,
			progress: 0,
			remote_reachable: true,
			remote_responseTime: '-',
			tables_str: tables_str,
			since_lastsync_str: '-'
		};
	},
	
	_render_noreach: function(){
		return (
			<View style={styles.container}>
				<View style={styles.page}>
					<View
						style={[styles.nr_icontxtlabel_wrap, {marginTop:200}]}>
						<Icon
							name='ion|arrow-swap'
							size={100}
							color='#DEDEDE'
							style={styles.nr_icontxtlabel_icon} />
						<Text style={styles.nr_icontxtlabel_text}>
							No route to server
						</Text>
						<Text style={styles.nr_icontxtlabel_text_p}>
							The application needs to connect to the internet {"\n"}
							to upload registrations.{"\n"}

						</Text>
					</View>
				</View>
			</View>
		);
	},

	render: function(){

		if( !this.state.is_setup ){
			this._setup();
		}

		if( !this.state.remote_reachable ){
			return this._render_noreach();
		}

		var num_regs = (Datastore.data.ready > 0) ? Datastore.data.countWhereNo("registrations", "uploaded") : 0;

		var num_regs_str = "You have no unsaved registrations.";
		if( num_regs == 1 ){
			num_regs_str = "You have 1 unsaved registration.";
		}
		if( num_regs > 1 ){
			num_regs_str = "You have "+ num_regs +" unsaved registrations.";
		}

		var btnORprog = this.state.working
				? (<TouchableHighlight style={[styles.button, styles.button_cancel]} onPress = {this.onPressCancelSync} underlayColor='#F5D865'>
					  <Text style={styles.buttonText}>Cancel</Text>
					</TouchableHighlight>)

				: ( <View>
						<TouchableHighlight style={[styles.button, styles.button_active]} onPress = {this.onPressSync} underlayColor='#aaa'>
						  <Text style={styles.buttonText}>Sync</Text>
						</TouchableHighlight>
					</View> );


		var logview = this.state.show_log 
				? ( <View>
						<Text style={styles.infotext_title}>
							PROGRESS
						</Text>

						<View style={styles.progressbar}><ProgressBar
							completePercentage={this.state.progress}
							color={'#48BBEC'}
							backgroundColor={'#eee'} /></View>

						<ScrollView style={styles.logview} 
							showsVerticalScrollIndicator={true}
							automaticallyAdjustContentInsets={false}>
							<Text style={styles.progress_text_body}>{this.state.progress_message}</Text>
						</ScrollView>
					</View>)

				: (<View></View>);

		var dlview = this.state.show_dl
				? ( <View>
						<Text style={styles.infotext_title}>
							DOWNLOAD PROGRESS
						</Text>

						<View style={styles.progressbar}><ProgressBar
							completePercentage={this.state.progress_dl}
							color={'#48BBEC'}
							backgroundColor={'#eee'} /></View>

						<View style={styles.progressbar}><ProgressBar
							completePercentage={this.state.progress_dlcurr}
							color={'#48BBEC'}
							backgroundColor={'#eee'} /></View>

					</View>)

				: (<View></View>);

		var ulview = this.state.show_ul
				? ( <View>
						<Text style={styles.infotext_title}>
							UPLOAD PROGRESS
						</Text>

						<View style={styles.progressbar}><ProgressBar
							completePercentage={this.state.progress_dl}
							color={'#48BBEC'}
							backgroundColor={'#eee'} /></View>

					</View>)

				: (<View></View>);			


		return (
			<ScrollView style={styles.container}>
			  <View style={styles.page}>

				<View
					style={[styles.nr_icontxtlabel_wrap, {marginTop:20}]}>
					<Icon
						name='ion|arrow-swap'
						size={60}
						color='#DEDEDE'
						style={styles.nr_icontxtlabel_icon} />
					
					<Text style={styles.nr_icontxtlabel_text}>
						Current response-time: {this.state.remote_responseTime}
					</Text>
					
					<Text style={styles.nr_icontxtlabel_text_p}>
						{"\n"}
						This will synchronise
					</Text>
					
					<Text style={styles.nr_icontxtlabel_text_em}>
						{this.state.tables_str}
					</Text>

					<Text style={styles.nr_icontxtlabel_text_p}>
						and upload your registrations to the server.{"\n"}
					</Text>
					
					<Text style={styles.nr_icontxtlabel_text_em}>
						{num_regs_str}{"\n"}
					</Text>

				</View>

				{btnORprog}

				{logview}

				{dlview}

				{ulview}

				<View>
					<Text style={styles.nr_icontxtlabel_text_em}>
						{"\n\n"}Last sync:{"\n"}{ this.state.since_lastsync_str }
					</Text>
				</View>

			</View>
		</ScrollView>);	
	},

	onPressCancelSync: function(){
		console.log('onPressCancelSync');
		Datastore.sync.abort();
	},

	onPressSync: function(){
		console.log('RunSyncChain - begin');
		
		Datastore.sync.chained(this, function(){
			console.log('onPressSyncDev > RunSyncChain done!');
		});
		
		//Datastore.sync.abort();
	}
	
});


module.exports = Sync;

// Local styles
var styles = StyleSheet.create({

	nr_icontxtlabel_wrap:{
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 5,
	},

	icontxtlabel_wrap_margintop: {
		marginTop: 100,
	},

	nr_icontxtlabel_icon:{
		width: 100,
		height: 100,
	},
	nr_icontxtlabel_text:{
		color: '#555',
		marginTop: 20,
		fontFamily: 'HelveticaNeue-Medium',
		fontSize: 15
	},
	nr_icontxtlabel_text_p:{
		flex: 1,
		color: '#555',
		fontFamily: 'HelveticaNeue',
		fontSize: 13,
		textAlign: 'center'
	},
	nr_icontxtlabel_text_em:{
		flex: 1,
		color: '#555',
		fontFamily: 'HelveticaNeue-Medium',
		fontSize: 13,
		textAlign: 'center'
	},

	icontxtlabel_wrap:{
		backgroundColor: '#ccc',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: 5,
		marginBottom: 20,
	},
	icontxtlabel_icon:{
		width: 24,
		height: 24,
		marginLeft: 5
	},
	icontxtlabel_text:{
		marginLeft: 7,
		fontFamily: 'HelveticaNeue-Medium',
		fontSize: 15
	},
	icontxtlabel_color_ok: {
		color: '#555',
	},
	icontxtlabel_color_warn: {
		color: '#FF2851',
	},

	welcome : {
		fontSize: 30,
		color: '#09F'
	},
	container: {
		backgroundColor: '#eee',
		flex: 1,
	},
	page: {
		padding: 20,
	},


	button: {
		height: 36,
		backgroundColor: '#ccc',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	button_active: {
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
	},
	button_disabled: {
		backgroundColor: '#eee',
		borderColor: '#ccc',
	},
	button_cancel: {
		backgroundColor: '#FFCD00',
		borderColor: '#FFCD00',
	},

	title: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 30
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center',
		fontFamily: 'HelveticaNeue-Medium',
	},
	buttonText_noroute: {
		fontSize: 18,
		color: '#B3B3B3',
		alignSelf: 'center',
		fontFamily: 'HelveticaNeue-Medium',
	},
	
	infotext: {
		fontSize: 12,
		marginBottom: 10,
	},
	infotext_title: {
		fontSize: 11,
		fontWeight: 'bold',
		color: '#555',
		marginBottom: 6,
	},
	infotext_body: {
		fontSize: 11,
		color: '#444',
		marginBottom: 10,
		lineHeight: 14
	},
	infotext_tables: {
		color: "#09f",
		marginBottom: 0,
		marginTop: -10,
	},

	infobox: {
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#ccc',
		backgroundColor: '#fff',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		margin: 0,
		marginLeft: -20,
		marginRight: -20,
		marginBottom: 10,
	},

	logview: {
		backgroundColor: '#ccc',
		padding: 10,
		height: 130,
	},
	progress_text_body: {
		fontFamily: 'Menlo-Regular',
		fontSize: 12,
		color: "#444",
	},

	progressbar: {
	}

});
