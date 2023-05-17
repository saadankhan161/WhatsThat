import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalstyles from '../GlobalStyles';
import * as ImagePicker from 'expo-image-picker';

class ProfileScreen extends Component { // this screen contains all the information of the logged in user aswell as navigation to the profile update screen
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      profilePicUri: null
    };
  }

  componentDidMount() {
    this.fetchProfile();    
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchProfile());
  }
  

  componentWillUnmount() {
    this._unsubscribe();
  }

  fetchProfile = async () => { // fetches the profile of the logged in user including the profile picture
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId'); 
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'GET',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized. Invalid or missing token.');
        return;
      }

      const profileData = await response.json();
      this.setState({ profile: profileData });

      const profilePicResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        method: 'GET',
        headers: {
          'X-Authorization': `${token}`,
          'Content-Type' : 'image/png'
        },
      });

      if (profilePicResponse.ok) {
        const profilePicUri = URL.createObjectURL(await profilePicResponse.blob());
        this.setState({ profilePicUri });
      } else {
        console.error('Failed to fetch profile picture.');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  updateProfilePic = async () => { // handles the interaction with the installedimagepicker library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.uploadImage(result.uri);
    }
  };

  uploadImage = async (uri) => { //function handelling the uploading of an image
    const token = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');

    let image = await fetch(uri); // fetches imge from local uri 
    let blob = await image.blob();// converts this image into a blob

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type' : 'image/png' // set the content type to image/png
        },
        body: blob,
      });

      if (response.ok) {
        this.fetchProfile();
      } else {
        console.error('Failed to upload image:', response.statusText);
      }
    }
    catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  logout = async () => { // function to handle the api call to log oout
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': `${token}`,
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        this.props.navigation.replace('Login'); 
      } else {
        console.error('Failed to logout.');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  render() {
    const { profile, profilePicUri } = this.state;

    if (!profile) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={globalstyles.container}>
        <View style={globalstyles.box}>
          <Image 
            style={{ width: 200, height: 200 }} 
            source={{ uri: profilePicUri || 'https://via.placeholder.com/200' }} // use the provided picture or a placeholder image
          />
          <TouchableOpacity onPress={this.updateProfilePic}>
            <Text style={globalstyles.text}>Update Profile Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={globalstyles.box}>
          <Text style={globalstyles.text}>First Name: {profile.first_name}</Text>
        </View>
        <View style={globalstyles.box}>
          <Text style={globalstyles.text}>Last Name: {profile.last_name}</Text>
        </View>
        <View style={globalstyles.box}>
          <Text style={globalstyles.text}>Email: {profile.email}</Text>
        </View>
        <TouchableOpacity style={globalstyles.box} onPress={this.logout}>
          <Text style={globalstyles.text}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalstyles.box} onPress={() => this.props.navigation.navigate('ProfileUpdate')}>
          <Text style={globalstyles.text}>Update Profile</Text>
        </TouchableOpacity>            
      </View>
    );
  }
}

export default ProfileScreen;



