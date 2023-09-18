import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
class DraftsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drafts: [],
            currentDraft: '',
        }
        this.chatId = this.props.route.params.chatId; // get the chatId from the navigation params
        this.draftsKey = `drafts_${this.chatId}`; // create a unique key for the drafts of this chat
    }

    componentDidMount() {
        this.fetchDrafts();
    }

    fetchDrafts = async () => {
        const drafts = await AsyncStorage.getItem(this.draftsKey);
        if (drafts !== null) {
            this.setState({ drafts: JSON.parse(drafts) });
        }
    };

    saveDraft = async () => {
        const { drafts, currentDraft, editingIndex } = this.state;

        let newDrafts;
        if (editingIndex !== null) {            
            newDrafts = [...drafts]; // if we are in edit mode edit the draft
            newDrafts[editingIndex] = currentDraft;
            this.setState({ editingIndex: null });
        } else {
            
            newDrafts = [...drafts, currentDraft]; // adding a new draft
        }

        this.setState({ drafts: newDrafts, currentDraft: '' });
        await AsyncStorage.setItem(this.draftsKey, JSON.stringify(newDrafts));
    };

    deleteDraft = async (index) => {
        const { drafts } = this.state;

        const newDrafts = drafts.filter((_, i) => i !== index);
        this.setState({ drafts: newDrafts });

        await AsyncStorage.setItem(this.draftsKey, JSON.stringify(newDrafts));
    };

    startEditing = (index, draft) => {
        this.setState({ editingIndex: index, currentDraft: draft });
    };

    sendMessage = async (message) => { 
        const chatId = this.chatId;
        // Send the POST request the api with the current chat id as a parameter in order to send the message
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
                this.fetchDrafts();
            } else {
                console.error('Failed to send message:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    
    
    render() {
        const { drafts, currentDraft } = this.state;
    
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={currentDraft}
                    onChangeText={(text) => this.setState({ currentDraft: text })}
                    placeholder="Type your draft here..."
                />
                <Button title="Save Draft" onPress={this.saveDraft} />
                <FlatList
                    data={drafts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.draftContainer}>
                            <Text style={styles.draft}>{item}</Text>
                            <View style={styles.iconsContainer}>
                                <TouchableOpacity onPress={() => this.startEditing(index, item)}>
                                    <Icon name="create-outline" size={20} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.sendMessage(item)}>
                                    <Icon name="send-outline" size={20} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.deleteDraft(index)}>
                                    <Icon name="trash-outline" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }
}    
const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
padding: 10,
},
input: {
height: 40,
borderColor: 'gray',
borderWidth: 1,
marginBottom: 10,
},
draftContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
padding: 10,
marginBottom: 10,
borderColor: 'gray',
borderWidth: 1,
borderRadius: 5,
},
draft: {
fontSize: 18,
},
iconsContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
width: 60,
}
});
export default DraftsScreen;