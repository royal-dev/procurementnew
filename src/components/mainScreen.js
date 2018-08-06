import React, {
	Component
} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	ToastAndroid
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
	Form,
	Subtitle
} from 'native-base';

import * as firebase from 'firebase';
export default class MainScreen extends Component {
	state = {
		isLoading: false,
		text: '',
		selected: false,
		amount: '',
		weight: '',
		rate: '',
		timestamp: ''
	}
	componentWillMount(){
		{this.getTime()};
	}

	googleSheets(){
		var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('1tN7RCtvgBTdYNZLSh59UsO5F4xkSZ9F0n7dxc1uT3Q8');
var sheet;

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('./procurement-1535458d26e2.json');
    // OR, if you cannot save the file locally (like on heroku)
    var creds_json = {
      client_email: 'procurement@procurement-212419.iam.gserviceaccount.com',
      private_key: '535458d26e289cdda6f3790f92ecaca2bbaff37'
    }
    doc.useServiceAccountAuth(creds, step);
  }]);
 
	}

	getTime() {
		var date, TimeType, hour, minutes, seconds, fullTime;
		date = new Date();
		hour = date.getHours();
		if (hour <= 11) {
			TimeType = 'AM';
		}
		else {
			TimeType = 'PM';
		}
		if (hour > 12) {
			hour = hour - 12;
		}
		if (hour == 0) {
			hour = 12;
		}
		minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes.toString();
		}
		seconds = date.getSeconds();
		if (seconds < 10) {
			seconds = '0' + seconds.toString();
		}
		fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();
		this.setState({timestamp: fullTime});
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
				amount: "" + result + " Rs."
			})
			this.googleSheets();
		} else if (weight == '' && amount != '' && rate != '') {
			let result = parseInt(amount) / rate;
			this.setState({
				weight: "" + result + " kgs."
			})
			this.googleSheets();
		} else if (rate == '' && amount != '' && weight != '') {
			let result = parseInt(amount) / weight;
			this.setState({
				rate: "" + result + " Rs."
			})
			this.googleSheets();
		} else {
			Alert.alert('Error', 'Please check the data');
		}


	}
	logout() {
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
		}, function (error) {
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
				{item.image && <Image source={item.image} style={style.cardImage} />}
			</CardItem>
			<CardItem>
				<Left>
					<Text style={style.inputTextStyle}>{item.label}</Text>
				</Left>
				<Right><Icon  name="ios-time" />
				<Text style={style.timeStampStyle}>{this.state.timestamp}</Text></Right>
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
							onChangeText={amount => this.setState({ amount })}
							value={this.state.amount}
							keyboardType="numeric"
							placeholder="Amount" />
					</Item>
					<Item>
						<Icon name="ios-pricetag" />
						<Input
							onChangeText={rate => this.setState({ rate })}
							value={this.state.rate}
							keyboardType="numeric" placeholder="Rate" />
					</Item>
					<Item>
						<Icon type="MaterialCommunityIcons" name="weight-kilogram" />
						<Input
							onChangeText={weight => this.setState({ weight })}
							value={this.state.weight}
							keyboardType="numeric" placeholder="Weight" />
					</Item>
				
				</Content>
			</CardItem>
			
			
			
			<CardItem>
				<Content>
					<Button block info onPress={() => this.validator()}>
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
						<Subtitle>Meri Mandi</Subtitle>
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
							<TouchableOpacity onPress={() => this.setState({ text: item, selected: item })}>
								<Text style={style.inputTextStyle}>{item}</Text>
							</TouchableOpacity>
						)}
					/>
					{this.renderSelected(selected)}
				</Content>
			</Container>
		);
	}

}
const style = StyleSheet.create({
	timeStampStyle:{
fontSize:16
	},
	inputTextStyle: {
		fontSize: 22,

	},
	cardImage: {
		height: 200,
		width: null,
		flex: 1
	}
})
