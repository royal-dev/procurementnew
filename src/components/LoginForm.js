import React, {
	Component
} from 'react';
import MainScreen from './MainScreen';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	ActivityIndicator,
	Alert,
	AsyncStorage
} from 'react-native';
import * as firebase from 'firebase';
import {
	GoogleSignin,
	GoogleSigninButton
} from 'react-native-google-signin';
export default class LoginForm extends Component {
	state = {
		username: '',
		password: '',
		loading: false,
		error: '',
		authUser: null
	};
	componentDidMount() {
		//Get saved user if already there
		AsyncStorage.getItem('authUser').then(v => (v ? this.setState({
			authUser: JSON.parse(v)
		}) : null));

		//Save user if auth successful
		firebase.auth().onAuthStateChanged(authUser => {
			authUser
				?
				this.setState({
					authUser
				}) :
				this.setState({
					authUser: null
				});
			if (authUser) {
				AsyncStorage.setItem('authUser', JSON.stringify(authUser));
			}
		});
		this.setupGoogleSignin();
	}
	async setupGoogleSignin() {
		try {
			await GoogleSignin.hasPlayServices({
				autoResolve: true
			});
			await GoogleSignin.configure({
				webClientId: '1065488977040-ha2vb5un8q8lqu6ur44pg1vilci4iot4.apps.googleusercontent.com',
				offlineAccess: false
			});

			const user = await GoogleSignin.currentUserAsync();
			console.log(user);
			//this.setState({user});
		} catch (err) {
			console.log("Play services error", err.code, err.message);
		}
	}
	onPressSignIn() {
		GoogleSignin.hasPlayServices({
				autoResolve: true
			})
			.then(() => {
				GoogleSignin.signIn()
					.then((data) => {
						// Create a new Firebase credential with the token
						const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
						// Login with the credential
						return firebase.auth().signInWithCredential(credential);
					})
					.then((user) => {
						// If you need to do anything with the user, do it here
						// The user will be logged in automatically by the
						// `onAuthStateChanged` listener we set up in App.js earlier
					})
					.catch((error) => {
						console.error(JSON.stringify(error))
						// For details of error codes, see the docs
						// The message contains the default Firebase string
						// representation of the error
					});
			})
			.catch(err => {
				console.log('Play services error', err.code, err.message);
			});
		/*
		const {
			username,
			password
		} = this.state;
		this.setState({
			loading: true
		})
		firebase.auth().signInWithEmailAndPassword(username, password).then(() => {
			this.setState({
				loading: false
			});
		}).catch((e) => {
			console.log(e);
			firebase.auth().createUserWithEmailAndPassword(username, password).then(() => {
				this.setState({
					loading: false
				});
			}).catch((e) => {
				console.log(e);
				this.setState({
					error: 'Authentication Failure',
					loading: false
				});
				Alert.alert('Error', 'Authentication Failure');
			});
		});*/
	}

	render() {
		if (this.state.loading) {
			return <View style={styles.logoContainer}>
          <ActivityIndicator size="large"/>
        </View>;
		}
		if (this.state.authUser) {
			return <MainScreen />;
		} else {
			return <KeyboardAvoidingView behavior="padding" style={styles.container} enabled>
        <View style={styles.logoContainer}>
        <Image 
        style={styles.logoStyle}
        source={require('../images/logo.png')}/>
        <Text style={styles.TextStyle}>Procurement Service</Text>
        </View>
        <View style={styles.loginContainer}>
		  <GoogleSigninButton
					style={{ height: 48 }}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Dark}
					onPress={()=>this.onPressSignIn()}/>
            </View>
      </KeyboardAvoidingView>;
		}
	}
}

const styles = StyleSheet.create({
	ButtonTextStyle: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700'
	},
	ButtonStyle: {
		backgroundColor: '#446CB3',
		paddingVertical: 15,
		marginBottom: 10,
		paddingHorizontal: 10,
		borderRadius: 10
	},
	TextInputStyle: {
		height: 40,
		backgroundColor: '#52B3D9',
		marginBottom: 20,
		paddingHorizontal: 10,
		color: '#FFF'
	},
	loginContainer: {
		padding: 20
	},
	container: {
		flex: 1,
		backgroundColor: '#C5EFF7',
	},
	logoContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 1,
		height: 250
	},
	logoStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 250,
		height: 250
	},
	TextStyle: {
		fontSize: 25,
		color: '#03A678',

	}
});
