import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as EmailValidator from 'email-validator';


export default class LoginForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "", 
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }
    async loginUser(userData) {
        try {
          const response = await fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
          });
      
          if (response.ok) {
            const jsonResponse = await response.json();
            console.log('JSON Response:', jsonResponse);
      
            if (jsonResponse.token) {
              await AsyncStorage.setItem('authToken', jsonResponse.token);
              console.log('Token stored:', jsonResponse.token);

              if (jsonResponse.id) {
                await AsyncStorage.setItem('userId', jsonResponse.id.toString());
                console.log('User ID stored:', jsonResponse.id);
              }

              this.props.navigation.navigate('TabNavigator');
            } else {
              this.setState({ error: "Invalid response, no token received" });
            }
          } else {
            this.setState({ error: "Invalid email or password" });
          }
        } catch (error) {
          console.error('Error:', error);
          this.setState({ error: "Failed to connect to the server" });
        }
      }
    _onPressButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.email && this.state.password)){
            this.setState({error: "Must enter email and password"})
            return;
        }

        if(!EmailValidator.validate(this.state.email)){
            this.setState({error: "Must enter valid email"})
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }
        this.loginUser({
            email: this.state.email,
            password: this.state.password,
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.email}>
                        <Text>Email:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter email"
                            onChangeText={email => this.setState({email})}
                            defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.password}>
                        <Text>Password:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter password"
                            onChangeText={password => this.setState({password})}
                            defaultValue={this.state.password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.loginbtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
            
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                            <Text style={styles.signup}>Need an account?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "light grey"
    },
    formContainer: {
    width: "80%"
    },
    email: {
    marginBottom: 5
    },
    password: {
    marginBottom: 10
    },
    loginbtn: {
    marginTop: 10,
    marginBottom: 10
    },
    signup: {
    justifyContent: "center",
    textDecorationLine: "underline",
    marginTop: 10
    },
    button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10
    },
    buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
    },
    error: {
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5
    },

})
    
  
    
    
    
    
    
    
    