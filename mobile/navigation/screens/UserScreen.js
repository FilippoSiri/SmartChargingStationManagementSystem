import * as React from 'react';
import { View, Text } from 'react-native';

const UserScreen = ({ navigation }) => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Home')}>User Screen</Text>
    </View>
  );
};

export default UserScreen;
