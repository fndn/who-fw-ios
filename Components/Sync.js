'use strict';

var React 			= require('react-native');
var Datastore       = require('./Datastore');

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

var _buffer = "";

var Sync = React.createClass({

	componentDidMount: function(){
		var self = this;
		Datastore.Remote.OnReachableStateChanged( function(state){
			//console.log('[Datastore.Tests] OnReachableStateChanged()');
			//console.log('[Datastore.Tests] Datastore.Remote.Reachable: '+ Datastore.Remote.Reachable() );
			//console.log('[Datastore.Tests] Datastore.Remote.ResponseTime: '+ Datastore.Remote.ResponseTime() );
			var reach = Datastore.Remote.Reachable() ? 'true' : 'false';
			self.setState({remote_reachable:reach, remote_responseTime: Datastore.Remote.ResponseTime() });
		});
	},

	getInitialState: function() {
		return {
			progress_message: "alo",
			working: false,
			has_log: false,
			progress: 0,
			remote_reachable: '-',
			remote_responseTime: '-',
		};
	},

	render: function(){

		var tables = Datastore.Config.tables.filter( function(el){ return Datastore.Config.uploadOnly.indexOf(el) == -1 }).join(", ");

		//var num_regs = Datastore.count("registrations");
		var num_regs = Datastore.countWhereNo("registrations", "uploaded");

		var num_regs_string = "All registrations has been uploaded.";
		if( num_regs > 0 ){
			num_regs_string = 'and upload all your '+ num_regs +' ';
			num_regs_string += (num_regs == 1) ? 'registration' : 'registrations';
			num_regs_string += ' to the datastore.'
		}

		var btnORprog = this.state.working
			? (<TouchableHighlight style={[styles.button, styles.button_active]} onPress = {this.onPressCancelSync} underlayColor='#aaa'>
				  <Text style={styles.buttonText}>Cancel</Text>
			 	</TouchableHighlight>)

			: ( <TouchableHighlight style={styles.button} onPress = {this.onPressSync} underlayColor='#99d9f4'>
				  <Text style={styles.buttonText}>Sync</Text>
			 	</TouchableHighlight> );



		var logview = this.state.has_log 
			? ( 
				<View>
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

			  	<Text style={styles.infotext}> {/* spacer */} </Text>

			  	<Text style={styles.infotext}>
					Text about how the Sync function(s) work.{"\n"}
					The app needs to connect to the internet to... {"\n"}{"\n"}
					
					Reachable: {this.state.remote_reachable}{"\n"}
					ResponseTime: {this.state.remote_responseTime}{"\n"}
				</Text>

				
				<View style={styles.infobox}>
					<Text style={styles.infotext_title}>
						SYNCHRONISE WITH SERVER
					</Text>
					
					<Text style={styles.infotext_body}>This will update</Text>	
					<Text style={[styles.infotext_body, styles.infotext_tables]}>{tables}</Text>
					<Text style={styles.infotext_body}>{num_regs_string}</Text>

					{btnORprog}

					{logview}
				</View>

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
				
				//self.setState({progress_message:_buffer, working:false, progress:0});
				self._startUpload();
			},
			// mode:
			"sync"
		);
	},

	_startUpload: function(){
		_buffer += "Starting Upload\n";

		var self = this;
		this.setState({working:true, has_log:true});
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
			},
			// mode:
			"upload"
		);
	}

});

module.exports = Sync;

// Local styles
var styles = StyleSheet.create({
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
    	backgroundColor: '#B8B8B8',
		padding: 10,
    	height: 200,
    },
    progress_text_body: {
    	color: "#666",
    },
    progressbar: {
    }

});
