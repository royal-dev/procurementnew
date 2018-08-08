import {Component,React} from 'react';
import {View} from 'react-native';
import {
	Container,
	Header,
	Title,
	Button,
	Left,
	Icon
} from 'native-base';

export default class ListShow extends Component{

render(){
    return(
    <View><Container>
        <Header>
            <Left>
                <Button transparent onPress={this.takemeBack()}>
                <Icon name='back'/>
                </Button>
            </Left>
            <Title>Procurement Report</Title>
            
            
        </Header>
       
           
        
    </Container>
    </View>);
}

}