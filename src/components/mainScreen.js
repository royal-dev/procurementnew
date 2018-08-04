import React, {
	Component
} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import {RkCard} from 'react-native-ui-kitten';
import Autocomplete from 'react-native-autocomplete-input';
import allData from './data.json';
export default class MainScreen extends Component {
	state = {
		isLoading: false,
		text: '',
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
			<View RkCardHeader>
			<Text>Search Procurement Item</Text>
			</View>
			<Autocomplete
			data={data}
			defaultValue={text}
			onChangeText={text => this.setState({ text })}
			renderItem={item => (
				<TouchableOpacity onPress={() => this.setState({  text:item,selected:  item })}>
				<Text>{item}</Text>
				</TouchableOpacity>
			)}
			/>
			{ this.renderSelected(selected) }
		  </RkCard>
		  </View>
		  
		);
	}

}
const style = StyleSheet.create({
	InputContainer:{
		paddingTop: 10,
		paddingRight: 10,
		paddingLeft: 10,
		paddingBottom: 10,


	},
	mainContainer: {
		flex: 1,
		backgroundColor: '#C5EFF7'
	},
	SearchBar: {
		paddingTop: 10,
		paddingRight: 10,
		paddingLeft: 10,
		paddingBottom: 10,
		marginBottom: 15

	}

})
