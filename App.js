import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoginForm from './Components/Login';
import LoginScreen from './Screens/LoginScreen';
import SignUpForm from './Components/Signup';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
      return (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpForm} />
        </Stack.Navigator>
      </NavigationContainer>     
      );

    }
} 