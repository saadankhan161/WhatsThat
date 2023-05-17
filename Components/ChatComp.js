import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalstyles from '../GlobalStyles';

class Chat extends Component { // component which handles each individual chat
    // triggered when user clicks on a chat and calls the onpress function
  handlePress = () => {
    const { chat, onPress } = this.props;
    onPress(chat.chat_id);
  };

  render() {
    const { chat } = this.props;
    return (
      <TouchableOpacity style={globalstyles.box} onPress={this.handlePress}>
        <Text>{chat.name}</Text>
      </TouchableOpacity>
    );
  }
}



export default Chat;