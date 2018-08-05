import React, {
	Component
} from 'react';
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Image
} from 'react-native';

import Autocomplete from 'react-native-autocomplete-input';
import allData from './data';
import {
	View,
	Card,
	NavigationBar
} from '@shoutem/ui';
export default class MainScreen extends Component {
	state = {
		isLoading: false,
		text: '',
		selected: false
	}
	renderSelected(item) {
		if (!!!item) {
			return null;
		}
		item = allData.filter((e) => e.label == item)[0];
		//https://shoutem.github.io/docs/ui-toolkit/components/cards
		return <Card>
			{item.image && <Image style={style.ImageContainer} source={item.image}/>}
			<View>
				<Text>{item.label}</Text>
			</View>
	 	</Card>;
	}
	render() {
		const {
			text,
			selected
		} = this.state;
		let data = [];
		if (text.length) {
			data = allData.filter((e) => e.label.toLowerCase().startsWith(text.toLowerCase())).map((e) => e.label);
		}
		return (
			<View styleName="fill-parent">
				<NavigationBar title="Procurement"/>
				<View
					style={{
					width: window.width,
					height: 70,
					}}
				></View>
				<ScrollView>
				<Autocomplete
					data={data}
					onChangeText={text => this.setState({ text })}
					renderItem={item => (
						<TouchableOpacity onPress={() => this.setState({  text:item,selected:  item })}>
						<Text style={style.inputTextStyle}>{item}</Text>
						</TouchableOpacity>
					)}
				/>
				{ this.renderSelected(selected) }
    			</ScrollView>
			</View>
		);
	}

}
const style = StyleSheet.create({
	navbarTitle: {
		width: "auto"
	},
	ImageContainer: {
		

		borderWidth: 1,
		borderRadius: 15,
		padding: 20,
		marginBottom: 15

	},
	mainContainer: {
		flex: 1,
		flexDirection: "column",
		alignContent: "flex-start",
		flexGrow: 1,
		height: "100%"
	},
	SearchBar: {
		height: 30,
		marginRight: 15,
		marginLeft: 15,
		backgroundColor: 'white',

	},
	inputTextStyle: {
		fontSize: 18
	}

})
