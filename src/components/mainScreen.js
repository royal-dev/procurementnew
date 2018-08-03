import React ,{ Component } from 'react';
import {View,Text,TextInput} from 'react-native';
import ProgressiveInput from 'react-native-progressive-input';

export default class mainScreen extends Component{
 state={isLoading:false,value:''}
 onChangeText(text){
this.setState({isLoading:true,text});
fetch("").then((result)=>{this.setState({isLoading:false});});
 }
    render(){
        return(
            <ProgressiveInput
            style={style.SearchBar}
            value={this.state.value}
            isLoading={this.state.isLoading}
            onChangeText={this.onChangeText.bind(this)}
          />
        );
    }
    
}
const style=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#C5EFF7'
    },
 SearchBar:{
     paddingTop:10,
     paddingRight:10,
     paddingLeft:10,
     paddingBottom:10,
     marginBottom:15


 }

})