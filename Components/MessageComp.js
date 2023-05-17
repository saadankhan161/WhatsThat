import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      isEditing: false,
      ediedmessage: '',
    };
  }

  async componentDidMount() {
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({ currentUserId: String(user_id) });
  }

  handleDeletePress = () => {
    const { message, onDelete } = this.props;
    onDelete(message.message_id);
  };

  handleEditPress = () => {
    this.setState({ isEditing: true, editedMessage: this.props.message.message });
  };

  handleConfirmPress = async () => {
    const { editedMessage } = this.state;
    const { message, chatId } = this.props;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${message.message_id}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: editedMessage }),
      });

      if (response.ok) {
        this.setState({ isEditing: false });
        this.props.onMessageUpdate(); 
      } else {
        console.error('Failed to update message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  render() {
    const { message } = this.props;
    const { currentUserId, isEditing, editedMessage } = this.state;
    const isCurrentUserMessage = String(message.author.user_id) === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUserMessage ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isEditing ? (
              <TextInput
                value={editedMessage}
                onChangeText={text => this.setState({ editedMessage: text })}
                style={styles.editInput}
                onSubmitEditing={this.handleConfirmPress}
              />
            ) : (
              <Text style={styles.messageText}>{message.message}</Text>
            )}
            {!isEditing && isCurrentUserMessage && (
              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <TouchableOpacity onPress={this.handleEditPress}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleDeletePress}>
                  <Text style={styles.deleteButtonText}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {!isCurrentUserMessage && (
            <Text style={styles.messageAuthor}>{message.author.first_name}</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
messageContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
borderRadius: 20,
padding: 10,
marginBottom: 10,
},
currentUserMessage: {
alignSelf: 'flex-end',
backgroundColor: 'lightgreen',
},
otherUserMessage: {
alignSelf: 'flex-start',
backgroundColor: 'lightgrey',
},
messageText: {
fontSize: 16,
},
messageAuthor: {
fontSize: 12,
textDecorationLine: 'underline',
},
deleteButtonText: {
color: 'red',
marginLeft: 10,
},
editButton: {
color: 'blue',
marginLeft: 10,
},
editInput: {
flex: 1,
borderColor: 'grey',
borderWidth: 1,
borderRadius: 10,
padding: 10,
},
});

export default Message;