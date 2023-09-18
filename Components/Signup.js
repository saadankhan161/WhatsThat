import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import * as EmailValidator from 'email-validator';

export default class SignUpForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "", 
            submitted: false,
            modalVisible: false 
        }

        this._onPressButton = this._onPressButton.bind(this)
    }
    async addUser(userData) {
        try {
            const response = await fetch('http://localhost:3333/api/1.0.0/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.setState({ modalVisible: true });
        } catch (error) {
            console.error('Error while adding user:', error);
            this.setState({ error: 'Error while adding user. Please try again.' });
        }
    }
    _onPressButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.email && this.state.password && this.state.confirmPassword)){
            this.setState({error: "Must enter email, password, and confirm password"})
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

        this.addUser({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
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
                   
                    <View style={styles.name}>
                        <Text>First Name:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter first name"
                            onChangeText={firstName => this.setState({firstName})}
                            defaultValue={this.state.firstName}
                        />

                        <>
                            {this.state.submitted && !this.state.firstName &&
                                <Text style={styles.error}>*First name is required</Text>
                            }
                        </>
                    </View>

                    <View style={styles.name}>
                        <Text>Last Name:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter last name"
                            onChangeText={lastName => this.setState({lastName})}
                            defaultValue={this.state.lastName}
                        />

                        <>
                            {this.state.submitted && !this.state.lastName &&
                                <Text style={styles.error}>*Last name is required</Text>
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
            
                    <View style={styles.password}>
                        <Text>Confirm Password:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Confirm password"
                            onChangeText={confirmPassword => this.setState({confirmPassword})}
                            defaultValue={this.state.confirmPassword}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.confirmPassword &&
                                <Text style={styles.error}>*Confirm password is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.loginbtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                    {this.state.error &&
                        <Text style={styles.error}>{this.state.error}</Text>
                    }
                </>
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.successTitle}>Sign Up Successful</Text>
                        <Text style={styles.successText}>Congratulations, you have successfully signed up!</Text>
                        <Button title="OK" onPress={() => this.setState({modalVisible: false})} />
                    </View>
                </View>
            </Modal>
        
               
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
name: {
marginBottom: 5
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
// Styles for my Modal
modalContainer: {
flex: 1,
justifyContent: "center",
alignItems: "center",
backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalContent: {
backgroundColor: "white",
padding: 20,
borderRadius: 10,
alignItems: "center",
justifyContent: "center",
},
successTitle: {
fontSize: 24,
fontWeight: "bold",
marginBottom: 10,
textAlign: "center",
},
successText: {
fontSize: 18,
marginBottom: 20,
textAlign: "center",
}
});