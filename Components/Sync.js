'use strict';

var React 			= require('react-native');
var Datastore       = require('./Datastore');

var GlobalStyles 	= require('../Styles/GlobalStyles');
var ProgressBar 	= require('./Parts/ProgressBar');

var { Icon, } 		= require('react-native-icons');

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

var _buffer = "";

var Sync = React.createClass({

	componentDidMount: function(){
		var self = this;
		Datastore.Remote.OnReachableStateChanged( function(state){
			console.log('[Sync] OnReachableStateChanged()');
			//console.log('[Datastore.Tests] Datastore.Remote.Reachable: '+ Datastore.Remote.Reachable() );
			//console.log('[Datastore.Tests] Datastore.Remote.ResponseTime: '+ Datastore.Remote.ResponseTime() );

			//console.log('[Sync] Datastore.countWhereNo: '+ Datastore.countWhereNo("registrations", "uploaded") );
			
			self.setState({
				remote_reachable:    Datastore.Remote.Reachable(),
				remote_responseTime: Datastore.Remote.ResponseTime()
			});

		});

		Datastore.OnChange( "registrations", function(data){
			console.log('[Sync] Datastore registrations OnChange() > countWhereNo: '+ Datastore.countWhereNo("registrations", "uploaded") );
			
			self.setState({
				remote_reachable:    Datastore.Remote.Reachable(),
				remote_responseTime: Datastore.Remote.ResponseTime()
			});
		});
	},

	getInitialState: function() {

		var _tables = Datastore.Config.tables.filter( function(el){ return Datastore.Config.uploadOnly.indexOf(el) == -1 });//.join(", ");
		var _last_table = _tables.pop();
		var tables_str = _tables.join(", ") + " and "+ _last_table;

		return {
			progress_message: "idle",
			working: false,
			has_log: false,
			progress: 0,
			remote_reachable: true,
			remote_responseTime: '-',
			tables_str: tables_str
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

		if( !this.state.remote_reachable ){
			return this._render_noreach();
		}

		var num_regs = Datastore.countWhereNo("registrations", "uploaded");

		var num_regs_str = "You have no unsaved registrations.";
		if( num_regs == 1 ){
			num_regs_str = "You have 1 unsaved registration.";
		}
		if( num_regs > 1 ){
			num_regs_str = "You have "+ num_regs +" unsaved registrations.";
		}

		var btnORprog = this.state.working
				? (<TouchableHighlight style={[styles.button, styles.button_active]} onPress = {this.onPressCancelSync} underlayColor='#aaa'>
					  <Text style={styles.buttonText}>Cancel</Text>
				 	</TouchableHighlight>)

				: ( <TouchableHighlight style={styles.button} onPress = {this.onPressSync} underlayColor='#99d9f4'>
					  <Text style={styles.buttonText}>Sync</Text>
				 	</TouchableHighlight> );


		var logview = this.state.has_log 
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



		return (
			<View style={styles.container}>
			  <View style={styles.page}>

				<View
					style={[styles.nr_icontxtlabel_wrap, {marginTop:25}]}>
					<Icon
						name='ion|arrow-swap'
						size={100}
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

			</View>
		</View>);	
	},

	onPressCancelSync: function(){
		console.log('onPressCancelSync');
	},

	onPressSync: function(){

		//console.log('DS all registrations >  ', Datastore.all('registrations') );

		_buffer = "";

		this._startSync();
		//this._startImageUpload(); // move to completion handler in _startUpload
	},

	_startImageUpload: function(){
		_buffer += "Starting Image upload\n";
		console.log('DS all registrations >  ', Datastore.all('registrations') );

	},

	_startSync: function(){
		_buffer += "Starting Two-way Sync\n";
		
		var self = this;
		this.setState({working:true, has_log:true});
		Datastore.Sync(
			// progress:
			function(step, steps, table){
				console.log("[Calee] SyncProgress: ", step, steps, table);
				_buffer += step +"/"+ steps +" : "+ table +"\n";

				// 3 / 6 = 50
				var percent =  (step / steps) * 100;

				self.setState({progress_message:_buffer, progress:percent});
			},
			// completion
			function(msg, error){
				console.log("[Calee] SyncComplete: ", msg );
				if( error ){
					_buffer = msg;
				}else{
					//_buffer += msg +"\n";
					_buffer += "Sync done.\n\n";
				}
				
				self.setState({progress_message:_buffer, working:false, progress:0});
				self._startUpload();
			},
			// mode:
			"sync"
		);
	},

	_startUpload: function(){
		_buffer += "Starting Upload\n";
		this.setState({working:true, has_log:true});

		var self = this;
		
		Datastore.Sync(
			// progress:
			function(step, steps, table){
				console.log("[Calee] UploadProgress: ", step, steps, table);
				_buffer += step +"/"+ steps +" : "+ table +"\n";

				// 3 / 6 = 50
				var percent =  (step / steps) * 100;

				self.setState({progress_message:_buffer, progress:percent});
			},
			// completion
			function(msg, error){
				console.log("[Calee] UploadComplete: ", msg );
				if( error ){
					_buffer = msg;
				}else{
					//_buffer += msg +"\n";	
					_buffer += "Upload done.\n";
				}
				
				self.setState({progress_message:_buffer, working:false, progress:0});
				self._startImageUpload();
			},
			// mode:
			"upload"
		);
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
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    button_active: {
    	backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    button_disabled: {
    	backgroundColor: '#eee',
        borderColor: '#ccc',
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
    	fontSize: 13,
    	color: "#444",
    },

    progressbar: {
    }

});
