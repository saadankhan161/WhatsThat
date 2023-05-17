import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from '../Components/ContactComp';


class CreateChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      const contactsData = await response.json();
      this.setState({ contacts: contactsData });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  handleCreateChat = async (userId, chatName) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      let response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'X-Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name": chatName,
        }),
      });

      console.log('Response:', response);

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      if (!response.ok) {
        console.error('Bad request:', await response.text());
        return;
      }

      const chatData = await response.json();

      response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatData.chat_id}/user/${userId}`, {
        method: 'POST',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      if (response.ok) {
        this.props.navigation.navigate('Chat', {chatId: chatData.chat_id });
      } else {
        console.error('Failed to add contact to chat.');
      }
    } catch (error) {
      console.error('Failed to create chat or add contact:', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}>
          {this.state.contacts.map((contact, index) => (
            <Contact
              key={index}
              contact = {contact}
              onRemove={() => {}}
              onBlock={() => {}}
              onUnblock={() => {}}
              onCreateChat = {this.handleCreateChat}
              showButtons = {false}
            />
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

export default CreateChatScreen;