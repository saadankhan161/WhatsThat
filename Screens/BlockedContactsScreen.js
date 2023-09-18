import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contact from '../Components/ContactComp';

class BlockedContactsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedContacts: [],
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchBlockedContacts());
    this.fetchBlockedContacts();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchBlockedContacts = async () => { // this function returns all the blocked contacts with the api call 
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      const blockedContactsData = await response.json();
      this.setState({ blockedContacts: blockedContactsData });
    } catch (error) {
      console.error('Failed to fetch blocked contacts:', error);
    }
  };

  unblockContact = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.29:3333/api/1.0.0/user/${userId}/block`, {
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
          blockedContacts: prevState.blockedContacts.filter((contact) => contact.user_id !== userId),
        }));
      } else {
        console.error('Failed to unblock contact.');
      }
    } catch (error) {
      console.error('Failed to unblock contact:', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Blocked Contacts</Text>
        {this.state.blockedContacts.map((contact, index) => (
          <Contact
            key={index}
            contact={contact}
            onRemove={() => {}}
            onBlock={() => {}}
            onUnblock={this.unblockContact}
            isBlocked={true}
            showButtons = {true}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'flex-start',
alignItems: 'center',
backgroundColor: "light grey"
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginTop: 50,
marginBottom: 20,
},
});

export default BlockedContactsScreen;