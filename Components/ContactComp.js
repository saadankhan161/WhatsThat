import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,TextInput } from 'react-native';

class Contact extends Component {
  state = {
    chatName: '',
    isCreatingChat: false,
  };

  handleCreateChat = () => {
    this.setState({ isCreatingChat: true });
  };

  handleChatNameChange = (text) => {
    this.setState({ chatName: text });
  };

  handleCreateChatConfirm = () => {
    const { contact, onCreateChat } = this.props;
    const { chatName } = this.state;
    onCreateChat( contact.user_id, chatName,);
    this.setState({ isCreatingChat: false, chatName: '' });
  };

  handleRemove = () => {
    const { contact, onRemove } = this.props;
    onRemove(contact.user_id);
  };

  handleBlock = () => {
    const { contact, onBlock } = this.props;
    onBlock(contact.user_id);
  };

  handleUnblock = () => {
    const { contact, onUnblock } = this.props;
    onUnblock(contact.user_id);
  };

  render() {
    const { contact, isBlocked, showButtons } = this.props;
    const { chatName, isCreatingChat } = this.state;
    const firstName = contact.first_name || contact.given_name;
    const lastName = contact.last_name || contact.family_name;

    return (
      <View style={styles.contactContainer}>
        <View style={styles.contactCard}>
          <Text style={styles.contactName}>
            {firstName} {lastName}
          </Text>
          {showButtons && (
            <>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={this.handleRemove}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={isBlocked ? styles.unblockButton : styles.blockButton}
                onPress={isBlocked ? this.handleUnblock : this.handleBlock}
              >
                <Text style={isBlocked ? styles.unblockButtonText : styles.blockButtonText}>
                  {isBlocked ? 'Unblock' : 'Block'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.createChatButton}
            onPress={this.handleCreateChat}
          >
            <Text style={styles.createChatButtonText}>Create Chat</Text>
          </TouchableOpacity>
          {isCreatingChat && (
            <View style={styles.chatNameInputContainer}>
              <TextInput
                style={styles.chatNameInput}
                onChangeText={this.handleChatNameChange}
                value={chatName}
                placeholder="Enter chat name"
              />
              <TouchableOpacity
                style={styles.createChatConfirmButton}
                onPress={this.handleCreateChatConfirm}
              >
                <Text style={styles.createChatConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
contactContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
lignItems: 'center',
width: '100%',
marginBottom: 20,
},
contactCard: {
backgroundColor: 'darkgrey',
borderRadius: 10,
padding: 10,
height: 120,
justifyContent: 'center',
width: '100%',
},
removeButton: {
backgroundColor: 'grey',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
removeButtonText: {
color: 'white',
fontSize: 14,
},
blockButton: {
backgroundColor: 'maroon',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
blockButtonText: {
color: 'white',
fontSize: 14,
},
unblockButton: {
backgroundColor: 'pink',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
unblockButtonText: {
color: 'white',
fontSize: 14,
},
createChatButton: {
backgroundColor: 'lightgreen',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
createChatButtonText: {
color: 'white',
fontSize: 14,
},
chatNameInputContainer: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 10,
},
chatNameInput: {
flex: 1,
height: 40,
borderColor: 'gray',
borderWidth: 1,
borderRadius: 4,
paddingHorizontal: 10,
},
createChatConfirmButton: {
backgroundColor: 'blue',
borderRadius: 4,
marginLeft: 10,
paddingVertical: 5,
paddingHorizontal: 10,
},
createChatConfirmButtonText: {
color: 'white',
fontSize: 14,
},
});

export default Contact;