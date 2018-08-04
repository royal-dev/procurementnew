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
	}
	onPressSignIn() {
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
		});
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
              <TextInput placeholder="username"
              placeholderTextColor='#FFF'
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={()=>this.passwordInput.focus()}
              style={styles.TextInputStyle}
              value={this.state.username}
              onChangeText={username => this.setState({username})}/>
              <TextInput 
              placeholder="password"
              placeholderTextColor='#FFF'
              secureTextEntry
              ref={(input)=> this.passwordInput=input}
              style={styles.TextInputStyle}
              value={this.state.password}
              onChangeText={password => this.setState({password})}/>
              <TouchableOpacity style={styles.ButtonStyle} onPress={()=> this.onPressSignIn()}>
              <Text style={styles.ButtonTextStyle}>Log In</Text></TouchableOpacity>
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
