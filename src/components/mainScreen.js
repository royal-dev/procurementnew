import React, {
	Component
} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	ToastAndroid,
	ListView
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
		timestamp: '',
		pList: []
	}

	constructor(props) {

		super(props);
	
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		
		this.state = {
	
		  dataSource: ds.cloneWithRows(this.state.pList),
		
		};
	
	  }
	  ListViewItemSeparator = () => {
		return (
		  <View
			style={{
			  height: .5,
			  width: "100%",
			  backgroundColor: "#000",
			}}
		  />
		);
	  }

	addtoList(){
		const {amount,weight,selected,rate}=this.state;
		this.setState((prevState) => {
			prevState.pList.push('listItem',{
				amount: amount,
				weight:weight,
				selected:selected,
				rate:rate
			}
			);
			return prevState; 
			})
	}
	googleSheets() {
		var formData = new FormData();
		formData.append("values", JSON.stringify([
			{
				"ItemName": this.state.selected,
				"Weight": this.state.weight,
				"Rate": this.state.rate,
				"Amount": this.state.amount,
				"UserID": firebase.auth().currentUser.email
			}
		]))
		fetch('https://script.google.com/macros/s/AKfycbyaudxHGu0wkGqPmQRHkGBEHoTJI6-jAPFtERIihearDxsKCEc/exec', {
			mode: 'no-cors',
			method: 'post',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			body: formData
		}).then(function(response) {
			console.log(response.status)
			console.log("response");
			console.log(response)
		}).catch(console.log);
		firebase.database().ref('procurements/').remove();
	}

	getTime() {
		var date, TimeType, hour, minutes, seconds, fullTime;
		date = new Date();
		hour = date.getHours();
		if (hour <= 11) {
			TimeType = 'AM';
		} else {
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
		return hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();
	}
	showList(){
		
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
		} else if (weight == '' && amount != '' && rate != '') {
			let result = parseInt(amount) / rate;
			this.setState({
				weight: "" + result + " kgs."
			})
		} else if (rate == '' && amount != '' && weight != '') {
			let result = parseInt(amount) / weight;
			this.setState({
				rate: "" + result + " Rs."
			})
		} else {
			return Alert.alert('Error', 'Please check the data');
		}
		this.addtoList();

	}
	logout() {
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		}, function(error) {
			Alert.alert('Error','Temporary Error, 400');
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
						<Text>Procure Item</Text>
					</Button>
				</Content>
				
			</CardItem>
			<CardItem>
			<ListView
 
 				dataSource={this.state.dataSource}

 				renderSeparator= {this.ListViewItemSeparator}
 				renderRow={(rowData) => <Text style={styles.rowViewContainer}>{rowData}</Text>
		   }

/>
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
	timeStampStyle: {
		fontSize: 16
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
