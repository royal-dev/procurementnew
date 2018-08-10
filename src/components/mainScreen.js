import React, {
	Component
} from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	ToastAndroid,
	ListView,
	View
} from 'react-native';
import ListShow from './ListShow';

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

	constructor(props) {

		super(props);

		this.state = {
			isLoading: false,
			text: '',
			selected: false,
			amount: '',
			weight: '',
			rate: '',
			timestamp: '',
			pList: [],
			vList: false
		};

	}

	addtoList() {
		const {
			amount,
			weight,
			selected,
			rate
		} = this.state;
		this.setState((prevState) => {
			prevState.pList.push({
				amount: amount,
				weight: weight,
				selected: selected,
				rate: rate,
				'UserID': firebase.auth().currentUser.email
			});
			return prevState;
		});
		this.setState({
			amount:'',
			weight:'',
			rate:''
		});
		ToastAndroid.show('Updated', ToastAndroid.SHORT)
	}
	deleteListData(rowToDelete) {
		this.setState((prevState) => {
			prevState.pList = prevState.pList.filter((dataname) => {
				if (dataname.selected !== rowToDelete) {
					return dataname;
				}
			});
			return prevState;
		});
	}

	showList() {

		return <ListShow/>;
	}

	validator() {
		let {
			amount,
			weight,
			rate
		} = this.state;

		if (amount == '' && weight != '' && rate != '') {
			let result = parseFloat(weight) * rate;
			result = result.toFixed(2);
			amount = "" + result
		} else if (weight == '' && amount != '' && rate != '') {
			let result = parseFloat(amount) / rate;
			result = result.toFixed(2);
			weight = "" + result
		} else if (rate == '' && amount != '' && weight != '') {
			let result = parseFloat(amount) / weight;
			result = result.toFixed(2);
			rate = "" + result
		} else {
			return Alert.alert('Error', 'Please check the data');
		}
		this.setState({
			amount,
			weight,
			rate
		},
		() => this.addtoList());
	}
	logout() {
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
		}, function(error) {
			Alert.alert('Error', 'Temporary Error, 400');
		});
	}
	renderSelected(item) {
		const {
			amount,
			weight,
			selected,
			rate,
			vList
		} = this.state;
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
							value={amount}
							keyboardType="numeric"
							placeholder="Amount" />
					</Item>
					<Item>
						<Icon name="ios-pricetag" />
						<Input
							onChangeText={rate => this.setState({ rate })}
							value={rate}
							keyboardType="numeric" placeholder="Rate" />
					</Item>
					<Item>
						<Icon type="MaterialCommunityIcons" name="weight-kilogram" />
						<Input
							onChangeText={weight => this.setState({ weight })}
							value={weight}
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
			<Content style={
					{
						padding: 10,
						borderTopWidth: 1,
						borderColor: "#dadada"
					}
			}> 
			<Button block danger onPress={()=>this.setState({vList:true})}>
						<Text>Generate Report</Text>
					</Button>
			</Content>
			</CardItem>
		</Card>;
	}
	render() {
		if (this.state.vList) {
			return <ListShow list={this.state.pList} back={()=>this.setState({vList:false})} delete={(rowToDelete)=>this.deleteListData(rowToDelete)}/>;
		} else {

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
						onChangeText={text => text && this.setState({ text })}
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

}
const style = StyleSheet.create({
	listText: {
		fontSize: 14
	},
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
