import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';

// Screens name
const homeName = 'Home';
const searchName = 'Search';
const userName = 'User';
const profileName = 'Profile';

import global_style from '../style';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
    }}>
    <AuthStack.Screen name="User" component={UserScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Registration" component={RegistrationScreen} />
  </AuthStack.Navigator>
);

const MainContainer = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let routeName = route.name;

              if (routeName === homeName)
                iconName = focused ? 'home' : 'home-outline';
              else if (routeName === searchName)
                iconName = focused ? 'search' : 'search-outline';
              else if (routeName === userName || routeName === profileName)
                iconName = focused ? 'person' : 'person-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: global_style.main_color,
            tabBarInactiveTintColor: 'grey',
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: { padding: 10, height: 60 },
          })}>
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={profileName} component={AuthNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainContainer;
