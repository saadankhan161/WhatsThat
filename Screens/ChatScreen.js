import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from '../Components/MessageComp';
import Icon from 'react-native-vector-icons/Ionicons';
import Member from '../Components/MemberComp';

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: {},
      message: '',
      showMembers: false,
      editingChatName: false,
      newChatName: '',
    };

    this.scrollViewRef = React.createRef();
    this.intervalId = null;
  }

  componentDidMount() {
    this.fetchChat(); // the fetch chat function is called when the component is first mounted
    this.intervalId = setInterval(this.fetchChat, 3000); // This code will refresh the api call every 3 seconds in order to allow for real time conversations
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // the interval is cleared when the component is unmounted
    } 
  }

  fetchChat = async () => {          // The fetch chat function fetches for the current chat and contains the api all witch 
    const chatId = this.props.route.params.chatId;
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      const chatData = await response.json();
      this.setState({ chat: chatData });
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    }    
  };

  sendMessage = async () => { // in this funtion the api call is made to send a message the chatId is passed in as a parameter
    const { message } = this.state;
    const chatId = this.props.route.params.chatId;
    if (message.trim() === '') return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'X-Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        this.setState({ message: '' }); 
        this.fetchChat(); 

        if (this.scrollViewRef.current) {
           this.scrollViewRef.current.scrollToEnd({animated: true});
        }
      } else {
        console.error('Failed to send message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  removeUser = async (userId) => { // this function handles the DELETE api call which removes the user ${userId} from chat ${chatId} where both of these values are substituted with the relevant user
    const chatId = this.props.route.params.chatId;
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.ok) {
        this.fetchChat();
      } else {
        console.error('Failed to remove user:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  deleteMessage = async (messageId) => { // this function handles the DELETE api all which deletes a single message ${messageId} from a specific chat ${chatId}
    const chatId = this.props.route.params.chatId;
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.ok) {
        this.fetchChat();
      } else {
        console.error('Failed to delete message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  changeChatName = async () => { // This function handles the PATCH request to update the name of the chat
    const { newChatName } = this.state;
    const chatId = this.props.route.params.chatId;
    if (newChatName.trim() === '') return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newChatName }),
      });

      if (response.ok) {
        this.setState({ editingChatName: false }); 
        this.fetchChat(); 
      } else {
        console.error('Failed to change chat name:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to change chat name:', error);
    }
  };


  render() {
    const { chat, message, showMembers, editingChatName, newChatName } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          {!editingChatName ? (
            <>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Icon name="create-outline" size={25} onPress={() => this.setState({ editingChatName: true, newChatName: chat.name })} />
            </>
          ) : (
            <View style={styles.editChatNameContainer}>
              <TextInput
                style={styles.input}
                value={newChatName}
                onChangeText={text => this.setState({ newChatName: text })}
                placeholder="Enter new chat name..."
              />
              <Button title="Save" onPress={this.changeChatName} />
            </View>
          )}
          
          <Icon name="person-remove-outline" size={25} onPress={() => this.setState({ showMembers: !this.state.showMembers })} />
          <Icon name="md-create" size={25} onPress={() => this.props.navigation.navigate('Drafts', { chatId: this.props.route.params.chatId })}/>
        </View>
        {showMembers && (
          <View style={styles.membersContainer}>
            {chat.members.map((member) => (
              <Member
                key={member.user_id}
                member={member}
                onRemove={this.removeUser}
              />
            ))}
          </View>
        )}
        <ScrollView 
          contentContainerStyle={{ padding: 20 }}
          ref={this.scrollViewRef}
        >
          {chat.messages && chat.messages.slice().reverse().map((message, index) => (
            <Message 
              key={index} 
              message={message}
              chatId={this.props.route.params.chatId}
              onDelete={this.deleteMessage}
              onMessageUpdate={this.fetchChat}
            />
          ))}    
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={text => this.setState({ message: text })}
            placeholder="Type a message..."
          />
          <Button title="Send" onPress={this.sendMessage} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: 'white',
},
header: {
flexDirection: 'row',
justifyContent: 'flex-end',
paddingHorizontal: 20,
paddingVertical: 10,
},
membersContainer: {
backgroundColor: 'lightgrey',
borderRadius: 20,
padding: 20,
marginHorizontal: 20,
},
memberContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
backgroundColor: 'grey',
borderRadius: 20,
padding: 10,
marginBottom: 10,
},
removeButton: {
backgroundColor: 'red',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
removeButtonText: {
color: 'white',
},
inputContainer: {
flexDirection: 'row',
padding: 10,
},
chatName: {
fontWeight: 'bold',
fontSize: 20,
marginRight: 10,
},
editChatNameContainer: {
flexDirection: 'row',
alignItems: 'center',
},
input: {
flex: 1,
borderColor: 'grey',
borderWidth: 1,
borderRadius: 20,
padding: 10,
marginRight: 10,
},
});

export default ChatScreen;