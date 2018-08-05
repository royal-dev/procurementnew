import React, {
	Component
} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert
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
		selected: false,
		amount: '',
		weight: '',
		rate: ''
	}
	validator() {
		const {
			amount,
			weight,
			rate
		} = this.state;

		if (amount == '' && weight != '' && rate != '') {
			let result = parseInt(weight) * rate;
			this.setState({
				amount: "" + result
			})
		} else if (weight == '' && amount != '' && rate != '') {
			let result = parseInt(amount) / rate;
			this.setState({
				weight: "" + result
			})
		} else if (rate == '' && amount != '' && weight != '') {
			let result = parseInt(amount) / weight;
			this.setState({
				rate: "" + result
			})
		} else {
			Alert.alert('Error', 'Please check the data');
		}

	}
	logout() {
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
				<Text style={style.inputTextStyle}>{item.label}</Text>
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
					<Input 
					onChangeText={amount=> this.setState({amount})}
					value={this.state.amount}
					keyboardType="numeric" 
					placeholder="Amount" />
				</Item>
				<Item>
					<Icon name="ios-pricetag" />
					<Input 
					onChangeText={rate=> this.setState({rate})}
					value={this.state.rate}
					keyboardType="numeric" placeholder="Rate" />
				</Item>
				<Item>
					<Icon type="MaterialCommunityIcons" name="weight-kilogram" />
					<Input 
					onChangeText={weight=> this.setState({weight})}
					value={this.state.weight}
					keyboardType="numeric" placeholder="Weight" />
				</Item>
			</Content>
		 </CardItem>
		 <CardItem>
		 <Content>
		 <Button block info onPress={()=> this.validator()}>
            <Text>Add to Sheet</Text>
          </Button>
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
					<Title>Procurement Service</Title>
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
		fontSize: 22,

	},
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	}
})
