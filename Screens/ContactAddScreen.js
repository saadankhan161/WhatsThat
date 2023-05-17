import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfo from '../Components/UserInfo';

class ContactAddScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        search: '',
        users: [],
      };
    }

  handleSearch = async () => { //performs the api call with the query parameter to be able to add contacts with the search term
    try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}`, {
          headers: {
            'X-Authorization': `${token}`,
          },
        });
    
        if (response.status === 401) {
          console.error('Unauthorized. Invalid or missing token.');
          return;
        }
    
        const usersData = await response.json();
        this.setState({ users: usersData });
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    };
  

    render() {
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Search Users"
              onChangeText={(search) => this.setState({ search })}
              value={this.state.search}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={this.handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            <ScrollView>
              {this.state.users.map((user, index) => (
                <UserInfo
                  key={index}
                  user={user}
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
padding: 10,
},
input: {
height: 40,
borderColor: 'gray',
borderWidth: 1,
paddingLeft: 10,
marginBottom: 10,
},
searchButton: {
backgroundColor: 'midnightblue',
borderRadius: 4,
paddingVertical: 10,
paddingHorizontal: 15,
marginBottom: 20,
},
searchButtonText: {
color: 'white',
fontSize: 18,
textAlign: 'center',
},
});   

export default ContactAddScreen;