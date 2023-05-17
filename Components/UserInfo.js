import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserInfo extends Component {
  addUser = async () => { 
    const { user } = this.props;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.29:3333/api/1.0.0/user/${user.user_id}/contact`, {
        method: 'POST',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      if (!response.ok) {
        console.error('Failed to add user.');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  render() {
    const { user } = this.props;
    return (
      <View style={styles.userCard}>
        <Text style={styles.userName}>{user.given_name} {user.family_name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={this.addUser}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'midnightblue',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default UserInfo;