/**
 * Created by JacobMac on 25/08/15.
 */

'use strict';

var React       = require('react-native');
var Camera      = require('react-native-camera');

var {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	CameraRoll,
	NavigatorIOS
	} = React;

var counter = 0;
var captureText = "FRONT";

var CameraCapture = React.createClass({
	getInitialState: function() {
		counter = 0;
		captureText = "FRONT";
		return {
			cameraType: Camera.constants.Type.back,
			images: {
				front: null,
				back: null,
				left: null,
				right: null
			}
		}
	},

	componentDidMount: function()
	{
		console.log("CameraCapture did mount");
	},

	componentWillUnmount: function () {
		console.log("CameraCapture will unmount!");
		//this.refs.cam.stopCapture();
	},


	render: function() {

		return (
			<Camera
				ref="cam"
				style={styles.container}
				onBarCodeRead={this._onBarCodeRead}

				captureTarget={Camera.constants.CaptureTarget.disk}

				type={this.state.cameraType}>

					<View style={styles.buttonwrap}>
						<View style={styles.buttonwrap_center}>
							<Text style={styles.buttonText}>{captureText}</Text>
							
							<TouchableHighlight style={styles.roundbutton} onPress={this._takePicture}>
								<Text></Text>
							</TouchableHighlight>
						</View>
					</View>

			</Camera>
		);
	},
	_onBarCodeRead: function(e) {
		console.log(e);
	},
	_switchCamera: function() {
		var state = this.state;
		state.cameraType = state.cameraType === Camera.constants.Type.back
			? Camera.constants.Type.front : Camera.constants.Type.back;
		this.setState(state);
		//
	},
	_takePicture: function() {
		if(this.props.location) {
			var options = {
				metadata: {
					location: this.props.location
				}
			};
		}

		this.refs.cam.capture(options, this.onCapture);


	},

	onCapture: function (err, data) {
		if(err)
			console.log(err);
		var images = this.state.images;

		switch (counter)
		{
			case 0:
				captureText = "BACK";
				images.front = data;
				this.setState({images:images});
				break;
			case 1:
				captureText = "LEFT";
				images.back = data;
				this.setState({images:images});
				break;
			case 2:
				captureText = "RIGHT";
				images.left = data;
				this.setState({images:images});
				break;
			case 3:
				//captureText = "BACK";
				images.right = data;
				this.setState({images:images});
				break;
		}
		counter++;

		if(counter >= 4) {
			this.props.navigator.pop();
			this.props.camCallback(this.state.images, this.props.productPosition);
		}

	}

});


var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},

	buttonwrap: {
		bottom:120,
	},

	roundbutton:{
		backgroundColor: '#48BBEC',
		height:60,
		width:60,
		borderRadius:30,
		borderWidth: 2,
		borderColor: '#fff',
		padding:10,
		marginTop:20,
		alignSelf: 'center',
	},

	buttonText: {
		fontSize: 18,
		color: 'white',
		fontWeight: '500',
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0.2',
		padding:20
	},
	button: {
		height: 36,

		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,

		alignSelf: 'stretch',
	}
});

module.exports = CameraCapture;