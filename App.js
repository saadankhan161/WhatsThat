import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoginForm from './Components/Login';
import LoginScreen from './Screens/LoginScreen';
import SignUpForm from './Components/Signup';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import TabNavigator from './TabNavigator';
import BlockedContactsScreen from './Screens/BlockedContactsScreen';
import ContactAddScreen from './Screens/ContactAddScreen';
import ContactSearchScreen from './Screens/ContactSearchScreen';
import ProfileUpdateScreen from './Screens/ProfileUpdateScreen';
import ChatScreen from './Screens/ChatScreen';
import CreateChatScreen from './Screens/CreateNewChat';
import DraftsScreen from './Screens/DraftsScreen';
const Stack = createStackNavigator();

export default class App extends Component {
    render() {
      return (
        <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpForm} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="BlockedContacts" component={BlockedContactsScreen} />
        <Stack.Screen name="ContactAdd" component={ContactAddScreen} />
        <Stack.Screen name="ContactSearch" component={ContactSearchScreen} />
        <Stack.Screen name="ProfileUpdate" component={ProfileUpdateScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="CreateChat" component={CreateChatScreen} />
        <Stack.Screen name="Drafts" component={DraftsScreen} />
        </Stack.Navigator>
      </NavigationContainer>     
      );

    }
} 