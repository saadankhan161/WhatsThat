import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import globalstyles from '../GlobalStyles';

 class ProfileUpdateScreen extends Component { // in this screen the logged in user can update their profile

    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            error: "", 
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

    async updateUser(userData) {
        const userId = await AsyncStorage.getItem('userId');

        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Authorization': `${await AsyncStorage.getItem('authToken')}`
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                Alert.alert("Success", "User details updated successfully");
            } else {
                this.setState({ error: "Failed to update user details" });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({ error: "Failed to connect to the server" });
        }
    }

    _onPressButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.first_name && this.state.last_name && this.state.email && this.state.password)){
            this.setState({error: "All fields are required"})
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

        this.updateUser({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
        });
    }

  render(){
      return (
          <View style={globalstyles.container}>
              <View style={styles.formContainer}>
                  <View style={styles.email}>
                      <Text>First Name:</Text>
                      <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%"}}
                        placeholder="Enter first name"
                        onChangeText={first_name => this.setState({first_name})}
                        defaultValue={this.state.first_name}
                      />
                  </View>
                    
                  <View style={styles.email}>
                      <Text>Last Name:</Text>
                      <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%"}}
                        placeholder="Enter last name"
                        onChangeText={last_name => this.setState({last_name})}
                        defaultValue={this.state.last_name}
                      />
                  </View>

                  <View style={styles.email}>
                      <Text>Email:</Text>
                      <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%"}}
                        placeholder="Enter email"
                        onChangeText={email => this.setState({email})}
                        defaultValue={this.state.email}
                      />
                          {this.state.submitted && !this.state.email &&
                            <Text style={styles.error}>*Email is required</Text>
                          }
                          {this.state.submitted && !EmailValidator.validate(this.state.email) &&
                            <Text style={styles.error}>*Must enter valid email</Text>
                          }
                        </View>
                    
                        <View style={styles.inputField}>
                          <Text>Password:</Text>
                            <TextInput
                              style={{height: 40, borderWidth: 1, width: "100%"}}
                              placeholder="Enter password"
                              onChangeText={password => this.setState({password})}
                              defaultValue={this.state.password}
                        />
                          {this.state.submitted && !this.state.password &&
                            <Text style={styles.error}>*Password is required</Text>
                          }
                        </View>
                    
                        <TouchableOpacity onPress={this._onPressButton}>
                          <Text style={styles.submit}>Submit</Text>
                        </TouchableOpacity>
                    
                        <Text style={styles.error}>{this.state.error}</Text>
                    
                      </View>
                    </View>
                  );
                }
            }
                    
const styles = StyleSheet.create({
formContainer: {
width: "80%",
},
inputField: {
marginBottom: 20,
},
submit: {
padding: 10,
backgroundColor: '#1E90FF',
color: '#fff',
textAlign: 'center',
width: 100,
borderRadius: 5,
},
error: {
color: 'red',
marginTop: 20,
},
});
              
export default ProfileUpdateScreen;