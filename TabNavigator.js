import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './Screens/ChatsScreen';
import ContactsScreen from './Screens/ContactsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();


const getTabBarIcon = (iconName) => {
  return ({ color, size }) => (
    <Icon name={iconName} color={color} size={size} />
  );
};

const TabNavigatorComponent = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Chats" 
        component={ChatsScreen} 
        options={{
          tabBarIcon: getTabBarIcon("chatbubble-ellipses-outline")
        }} 
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{
          tabBarIcon: getTabBarIcon("people-outline")
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: getTabBarIcon("person-outline")
        }} 
      />
    </Tab.Navigator>
  );
};
export default TabNavigatorComponent;