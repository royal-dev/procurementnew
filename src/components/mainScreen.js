import React, {
	Component
} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Image
} from 'react-native';

import Autocomplete from 'react-native-autocomplete-input';
import allData from './data';
import {
	Container,
	Header,
	Title,
	Content,
	Card,
	CardItem,
	Button,
	Item,
	Input,
	Left,
	Right,
	Body,
	Icon,
	Text,
	Form
} from 'native-base';
import * as firebase from 'firebase';

export default class MainScreen extends Component {
	state = {
		isLoading: false,
		text: '',
		selected: false
	}
	logout(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		 }, function(error) {
			// An error happened.
		 });
	}
	renderSelected(item) {
		if (!!!item) {
			return null;
		}
		item = allData.filter((e) => e.label == item)[0];
		return <Card>
		 <CardItem cardBody>
		 	{item.image && <Image source={item.image} style={style.cardImage}/>}
		 </CardItem>
		 <CardItem>
			<Left>
				<Text>{item.label}</Text>
			</Left>
		 </CardItem>
		 <CardItem cardBody>
			<Content style={
				{
					padding: 10,
					borderTopWidth: 1,
					borderColor: "#dadada"
				}
			}>
				<Item>
					<Icon type="FontAwesome" name="money" />
					<Input keyboardType="numeric" placeholder="Amount" />
				</Item>
				<Item>
					<Icon name="ios-pricetag" />
					<Input keyboardType="numeric" placeholder="Rate" />
				</Item>
				<Item>
					<Icon type="MaterialCommunityIcons" name="weight-kilogram" />
					<Input keyboardType="numeric" placeholder="Weight" />
				</Item>
			</Content>
		 </CardItem>
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
			<Container>
				<Header>
					<Body>
					<Title>Procurement</Title>
					</Body>
					<Right>
						<Button hasText transparent onPress={this.logout}>
							<Text>Logout</Text>
						</Button>
					</Right>
				</Header>
				<Content style={
				{
					padding: 10
				}
			}>
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
			 </Content>
			</Container>
		);
	}

}
const style = StyleSheet.create({
	inputTextStyle: {
		fontSize: 18
	},
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	}
})
