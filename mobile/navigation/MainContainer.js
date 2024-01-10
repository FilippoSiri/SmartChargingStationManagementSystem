import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';

// Screens name
const homeName = 'Home';
const searchName = 'Search';
const userName = 'User';

const Tab = createBottomTabNavigator();

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
              else if (routeName === userName)
                iconName = focused ? 'person' : 'person-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'grey',
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: { padding: 10, height: 60 },
          })}>
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={userName} component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainContainer;
