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
	Dimensions
} from 'react-native';
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
	Text
	
} from 'native-base';


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

export default class DynamicList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => true
			}),
			refreshing: false,
			rowToDelete: null
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

		this.dataLoadSuccess({
			data: this.props.list
		});
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
						<Title>Procurement List</Title>
					</Body>
         		 <Right />
				</Header>
				<Content style={
					{
						padding: 10
					}
				}>
					<View style={styles.addPanel}>
					<Text style={{paddingBottom:20}}>Following list is editabe, you can use 'Add to Sheets' for final submission.</Text>
					
						<Button block danger 
							onPress={()=> this.googleSheets()}>
							<Text style={styles.addButtonText}>Add to Sheets</Text>
						</Button> 
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
				</Content>
			</Container>
		);
	}
	_renderRow(rowData, sectionID, rowID) {
		return (
			<DynamicListRow
                remove={rowData.selected === this.state.rowToDelete}
                onRemoving={this._onAfterRemovingElement.bind(this)}
            >
                <View style={styles.rowStyle}>

                    <View style={styles.contact}>
                        <Text style={[styles.name]}>{rowData.selected}</Text>
                        <Text style={styles.phone}>Weight : {rowData.weight} kgs</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteWrapper} onPress={() => this._deleteItem(rowData.selected)}>
                        <Icon name='md-remove-circle' style={styles.deleteIcon}/>
                    </TouchableOpacity>
                </View>
            </DynamicListRow>
		);
	}

	googleSheets() {
		var formData = new FormData();
		formData.append("values", JSON.stringify(this._data))
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
	}

	componentWillUpdate(nexProps, nexState) {
		if (nexState.rowToDelete !== null) {
			this._data = this._data.filter((item) => {
				if (item.selected !== nexState.rowToDelete) {
					return item;
				}
			});
		}
	}

	_deleteItem(id) {
		this.setState({
			rowToDelete: id
		});
		this.props.delete(id);
	}

	_onAfterRemovingElement() {
		this.setState({
			rowToDelete: null,
			dataSource: this.state.dataSource.cloneWithRows(this._data)
		});
	}

}

const styles = StyleSheet.create({
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

	rowStyle: {
		backgroundColor: '#FFF',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		flexDirection: 'row'
	},

	rowIcon: {
		width: 30,
		alignSelf: 'flex-start',
		marginHorizontal: 10,
		fontSize: 24
	},

	name: {
		color: '#212121',
		fontSize: 18
	},
	phone: {
		color: '#212121',
		fontSize: 12
	},
	contact: {
		width: window.width - 100,
		alignSelf: 'flex-start'
	},

	dateText: {
		fontSize: 10,
		color: '#ccc',
		marginHorizontal: 10
	},
	deleteWrapper: {
		paddingVertical: 10,
		width: 80,
		alignSelf: 'flex-end'
	},
	deleteIcon: {
		fontSize: 24,
		color: '#DA281C',
		alignSelf: 'center'
	}
});
