import React, {
	Component
} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import allData from './data.json';
export default class MainScreen extends Component {
	state = {
		isLoading: false,
		text:'',
		selected: false
	}
	renderSelected(item) {
		if (item == false) {
			return null;
		}
		item = allData.filter((e) => e.label == item)[0];
	}
	render() {
		const {
			text,
			selected
		} = this.state;
		data = allData.filter((e) => e.label.startsWith(text)).map((e) => e.label);
		return (
			<View style={style.mainContainer}>
			<View>
			<Text style={style.InputContainer}>Search Procurement Item</Text>
			</View>
			<Autocomplete
			style={style.SearchBar}
			data={data}
			onChangeText={text => this.setState({ text })}
			renderItem={item => (
				<TouchableOpacity onPress={() => this.setState({  text:item,selected:  item })}>
				<Text style={style.inputTextStyle}>{item}</Text>
				</TouchableOpacity>
			)}
			/>
			{ this.renderSelected(selected) }
		  </View>
		  
		);
	}

}
const style = StyleSheet.create({
	InputContainer:{
		fontWeight: '800',
		color:'#FFFFFF',
		borderWidth: 2,
		backgroundColor:'#013243',
		padding:20,
		fontSize: 22,
		justifyContent:'center',
		marginBottom: 15


	},
	mainContainer: {
		flex: 1,
		backgroundColor: '#C5EFF7'
	},
	SearchBar: {
		paddingTop: 10,
		marginRight: 15,
		marginLeft: 15,
		paddingBottom: 10,
		backgroundColor:'white'
	},
	inputTextStyle:{
		fontSize:18
	}

})
