import React, { Component } from 'react';
import {StyleSheet,Text,View, Image,TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';


export default class LoginForm extends Component {
  state={username:'', password:''};
    render() {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
              <TouchableOpacity style={styles.ButtonStyle}>
        <Text style={styles.ButtonTextStyle}>Log In</Text>
        </TouchableOpacity></View>
        </KeyboardAvoidingView>
        
      
        
      );
    }
  }
  
  const styles = StyleSheet.create({
    ButtonTextStyle:{
  textAlign:'center',
  color:'#FFF',
  fontWeight:'700'
    },
    ButtonStyle:{
      backgroundColor:'#446CB3',
      paddingVertical:15,
      marginBottom:10,
  paddingHorizontal: 10
    },
    TextInputStyle: {
      height: 40,
      backgroundColor:'#52B3D9',
      marginBottom: 20,
      paddingHorizontal: 10,
      color: '#FFF'
  },
  loginContainer:{
      padding: 20
  },
    container: {
      flex: 1,
      backgroundColor: '#C5EFF7',
    },
    logoContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow:1
  
    },
    logoStyle:{
      justifyContent: 'center',
      alignItems: 'center',
      width: 250,
      height: 250
    },
    TextStyle:{
      fontSize: 25,
      color: '#03A678',
  
  
    }
  
  });
  