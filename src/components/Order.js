import React, {
	Component
} from 'react';
import {
	View,
	ListView,
	ListViewDataSource,
	StyleSheet,
	TouchableOpacity,
	InteractionManager,
	RefreshControl,
	Animated,
	Dimensions,
	ToastAndroid,
	BackHandler
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Left,
	Right,
	Body,
	Icon,
	Text,
	FooterTab,
	Footer,
	Badge,
	Toast
} from 'native-base';
import firebase from 'firebase';
console.ignoredYellowBox=true

const window = Dimensions.get('window');

class DynamicListRow extends Component {

	_defaultHeightValue = 60;
	_defaultTransition = 500;

	state = {
		_rowHeight: new Animated.Value(this._defaultHeightValue),
		_rowOpacity: new Animated.Value(0)
	};

	componentDidMount() {
		Animated.timing(this.state._rowOpacity, {
			toValue: 1,
			duration: this._defaultTransition
		}).start()

		BackHandler.addEventListener('hardwareBackPress', () => {
			return false
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.remove) {
			this.onRemoving(nextProps.onRemoving);
		} else {
			this.resetHeight()
		}
	}

	onRemoving(callback) {
		Animated.timing(this.state._rowHeight, {
			toValue: 0,
			duration: this._defaultTransition
		}).start(callback);
	}

	resetHeight() {
		Animated.timing(this.state._rowHeight, {
			toValue: this._defaultHeightValue,
			duration: 0
		}).start();
	}

	render() {
		return (
			<Animated.View
                style={{height: this.state._rowHeight, opacity: this.state._rowOpacity}}>
                {this.props.children}
            </Animated.View>
		);
	}
}

export default class Order extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => true
			}),
			refreshing: false,
			rowToDelete: null,
			sheet: true,
			orderData: [],
			num:0,
		};
		
	}

	componentDidMount() {

		InteractionManager.runAfterInteractions(() => {
			this._loadData()
		});
	}

	_loadData(refresh) {
		refresh && this.setState({
			refreshing: true
		});
		this.readUserData();
	}

	dataLoadSuccess(result) {

		this._data = result.data;

		let ds = this.state.dataSource.cloneWithRows(this._data);

		this.setState({
			loading: false,
			refreshing: false,
			rowToDelete: -1,
			dataSource: ds
		});
		console.log(this._data);
	}
	_renderRow(rowData, sectionID, rowID) {
		let swipeBtns = [{
			text: 'Complete',
			backgroundColor: '#26A65B',
			underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
			onPress: () => { this._deleteItem(rowData) }
		  }, {
			text: 'Pending',
			backgroundColor: '#F64747',
			underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
			onPress: () => { ToastAndroid.show('Pending',ToastAndroid.SHORT) }
		 }];
		 
		return (
			
			<DynamicListRow>
                <View style={styles.rowStyle}>
				
                    <View style={styles.contact}>
					<Swipeout right={swipeBtns}
					autoClose={true}
       				 backgroundColor= 'transparent'>
                        <Text style={styles.name}>Order: {rowData.orderitem}, Weight: {rowData.orderweight} kgs</Text>
                        <Text style={styles.phone}>Dated: {rowData.date}, Order ID: {rowData.orderid}</Text>
						
					</Swipeout>
                    </View>
                </View>
            </DynamicListRow>
		);
	}
	  
_deleteItem(rowData){

	firebase.database().ref('orders').child(rowData.id).remove();
	
	ToastAndroid.show('Completed.',ToastAndroid.SHORT)
}

	
	
	readUserData() {
		let that = this;
		firebase.database().ref('orders/').on('value', function(snapshot) {
			let data = snapshot.val();
			if(data !== null){
			let orderData = [];
			let keys = Object.keys(data);
			let num=Object.keys(snapshot.val()).length;
			keys.forEach(function(e) {
				orderData.push(data[e]);
			})
			that.setState({
				orderData: orderData
			});
			that.dataLoadSuccess({
				data: orderData
			});
			
			that.setState({num:num});
		}else{
			that.setState({orderData:[]})
			that.setState({num:0});
		}
		});
	}
	render() {
		return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={()=>this.props.back()}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
					<Body>
						<Title>Orders</Title>
					</Body>
         		 <Right />
				</Header>
                <View style={styles.addPanel}>
					<Text style={styles.HeaderText}>Procurement Orders</Text>
					</View>
                <ListView
						refreshControl={
							<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._loadData.bind(this, true)}
							tintColor="#00AEC7"
							title="Loading..."
							titleColor="#00AEC7"
							colors={['#FFF', '#FFF', '#FFF']}
							progressBackgroundColor="#00AEC7"

							/>
						}
						enableEmptySections={true}
						dataSource={this.state.dataSource}
						renderRow={this._renderRow.bind(this)}
					/>
            <Footer>
         		 <FooterTab>
            		<Button vertical onPress={this.props.back}>
              		<Icon name="apps" />
              		<Text>Main</Text>
            		</Button>
            		<Button badge vertical>
					<Badge><Text>{this.state.num}</Text></Badge>
              		<Icon type="FontAwesome" name="shopping-cart" />
             		<Text>Orders</Text>
           			</Button>
					</FooterTab>
       				</Footer>
            </Container>);
	}

}
const styles = StyleSheet.create({
	subText: {
		paddingHorizontal:10,
		paddingTop:2,
		paddingBottom:2,
		fontSize: 12,
		fontFamily: "sans-serif",
		

	},
	HeaderText: {
		padding: 10,
		fontWeight: "600",
		fontSize: 22,
		fontFamily: "sans-serif"

	},
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	noData: {
		color: '#000',
		fontSize: 18,
		alignSelf: 'center',
		top: 200
	},

	addPanel: {
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#F9F9F9'
	},
	addButton: {
		backgroundColor: '#0A5498',
		width: 120,
		alignSelf: 'flex-end',
		marginRight: 10,
		padding: 5,
		borderRadius: 5
	},
	addButtonText: {
		color: '#fff',
		alignSelf: 'center'
	},

	rowStylePending: {
		backgroundColor: '#EC644B',
		paddingVertical: 2,
		paddingHorizontal: 5,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		flexDirection: 'row',
		
	},

	rowStyle: {
		backgroundColor: '#FFF',
		paddingVertical: 2,
		paddingHorizontal: 5,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		flexDirection: 'row',
		
	},

	rowIcon: {
		width: 30,
		alignSelf: 'flex-start',
		marginHorizontal: 10,
		fontSize: 24
	},

	name: {
		fontWeight: "500",
		color: '#212121',
		fontSize: 16
	},
	phone: {
		
		color: '#212121',
		fontSize: 16
	},
	contact: {
		width: window.width-10,
		alignSelf: 'flex-start'
	},

	dateText: {
		fontSize: 10,
		color: '#ccc',
		marginHorizontal: 10
	},
	deleteWrapper: {
		paddingVertical: 5,
		width: 60,
		alignSelf: 'flex-end'
	},
	keepWrapper: {
		paddingVertical: 5,
		width: 60,
		alignSelf: 'center'
	},
	deleteIcon: {
		fontSize: 24,
		color: '#DA281C',
		alignSelf: 'center'
	}
});
