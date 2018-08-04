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
import { RkCard } from 'react-native-ui-kitten';
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
			<RkCard>
			<View rkCardHeader>
			<Text style={style.InputContainer}>Search Procurement Item</Text></View>
			<View rkCardContent>
			<Autocomplete
			data={data}
			onChangeText={text => this.setState({ text })}
			renderItem={item => (
				<TouchableOpacity onPress={() => this.setState({  text:item,selected:  item })}>
				<Text style={style.inputTextStyle}>{item}</Text>
				</TouchableOpacity>
			)}
			/>
			</View>
			</RkCard>
			{ this.renderSelected(selected) }
			<RkCard>
			<View rkCardHeader>
			<Text>{this.state.selected}</Text></View>
			</RkCard>
			
		  </View>
		  
		  
		);
	}

}
const style = StyleSheet.create({
	InputContainer:{
		fontWeight: '600',
		
		borderWidth: 2,
		borderRadius:15,
		padding:20,
		fontSize: 22,
		justifyContent:'center',
		marginBottom: 15


	},
	mainContainer: {
		flex:1,
		backgroundColor: '#C5EFF7',
		
	},
	SearchBar: {
		height:30,
		marginRight: 15,
		marginLeft: 15,
		
		backgroundColor:'white',
		
	},
	inputTextStyle:{
		fontSize:18
	}

})
