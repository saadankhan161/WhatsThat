import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import Contact from '../Components/ContactComp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

class ContactSearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          search: '',
          contacts: [],
        };
      }
  handleSearch = async () => { // function contains the api call to search through your own contacts with the search parameter
    try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}&search_in=contacts`, {
          headers: {
            'X-Authorization': `${token}`,
          },
        });
    
        if (response.status === 401) {
          console.error('Unauthorized. Invalid or missing token.');
          return;
        }
    
        const contactsData = await response.json();
        console.log('Contacts data:', contactsData);
        this.setState({ contacts: contactsData });
      } catch (error) {
        console.error('Failed to search contacts:', error);
      }
    };

    render() {
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ search: text })}
              value={this.state.search}
              placeholder="Search contacts..."
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={this.handleSearch}
            >
              <Text style={styles.buttonText}>Search</Text>
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
justifyContent: 'center',
padding: 20,
},
title: {
fontSize: 24,
marginBottom: 20,
textAlign: 'center',
},
input: {
height: 40,
borderColor: 'gray',
borderWidth: 1,
paddingHorizontal: 10,
marginBottom: 20,
},
searchButton: {
backgroundColor: 'midnightblue',
borderRadius: 4,
paddingVertical: 10,
paddingHorizontal: 15,
marginBottom: 20,
},
buttonText: {
color: 'white',
textAlign: 'center',
},
});

export default ContactSearchScreen;