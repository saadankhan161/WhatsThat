import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chat from '../Components/ChatComp';
import Icon from 'react-native-vector-icons/Ionicons';

class ChatsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
    };
  }

  componentDidMount() {
    this.fetchChats();
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchChats()); 
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <Icon
            name="ios-chatbubbles-outline"
            size={30}
            color="#000"
            onPress={() => this.props.navigation.navigate('CreateChat')}
          />
        </View>
      ),
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchChats = async () => {
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      const chatsData = await response.json();
      this.setState({ chats: chatsData });
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  handleChatPress = (chatId) => {
    this.props.navigation.navigate('Chat', { chatId });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
          {this.state.chats.map((chat, index) => (
            <Chat key={index} 
            chat={chat} 
            onPress={this.handleChatPress} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'flex-start',
alignItems: 'stretch',
backgroundColor: 'lightgrey',
},
});

export default ChatsScreen;