import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from '../Components/ContactComp'; 
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchContacts());
    this.fetchContacts();
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <Icon
            name="ios-search"
            size={30}
            color="#000"
            style={{ marginRight: 20 }}
            onPress={() => this.props.navigation.navigate('ContactSearch')}
          />
          <Icon
            name="ios-person-add"
            size={30}
            color="#000"
            onPress={() => this.props.navigation.navigate('ContactAdd')}
          />
        </View>
      ),
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token retrieved:', token);
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
  removeContact = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.29:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      if (response.ok) {
        this.setState((prevState) => ({
          contacts: prevState.contacts.filter((contact) => contact.user_id !== userId),
        }));
      } else {
        console.error('Failed to remove contact.');
      }
    } catch (error) {
      console.error('Failed to remove contact:', error);
    }
  };
  
  blockContact = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.29:3333/api/1.0.0/user/${userId}/block`, {
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
        this.setState((prevState) => ({
        contacts: prevState.contacts.filter((contact) => contact.user_id !== userId),
        }));
      } else {
        console.error('Failed to block contact.');
      }
    } catch (error) {
      console.error('Failed to block contact:', error);
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

  goToBlockedContacts = () => {
    this.props.navigation.navigate('BlockedContacts');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity
        style={styles.blockedContactsButton}
        onPress={this.goToBlockedContacts}
        >
        <Text style={styles.blockedContactsButtonText}>View Blocked Contacts</Text>
        </TouchableOpacity>
        <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: '100%' }}
        showsVerticalScrollIndicator={true}>
        {this.state.contacts.map((contact, index) => (
          <Contact
            key={index}
            contact={contact}
            onRemove={this.removeContact}
            onBlock={this.blockContact}
            onCreateChat={this.handleCreateChat}
            showButtons = {true}
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
backgroundColor: "light grey"
},
title: {
fontSize: 24,
color: 'darkslategray', 
textAlign: 'center', 
fontWeight: 'bold',
marginTop: 50,
marginBottom: 20,
},
contactContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
width: '90%',
marginBottom: 20,
},
contactCard: {
backgroundColor: 'darkgrey',
borderRadius: 10,
padding: 10,
height: 100,
justifyContent: 'center',
width: '100%',
},
contactName: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 5,
},
contactNumber: {
fontSize: 16,
},
removeButton: {
backgroundColor: 'purple',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
alignSelf: 'flex-end',
},
removeButtonText: {
color: 'white',
fontSize: 14,
},
blockedContactsButton: {
backgroundColor: 'midnightblue',
borderRadius: 4,
paddingVertical: 10,
paddingHorizontal: 15,
alignSelf: 'center',
marginBottom: 20,
},
blockedContactsButtonText: {
color: 'white',
fontSize: 18,
},
});

export default ContactsScreen;