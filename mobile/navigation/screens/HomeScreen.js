import * as React from 'react';
import { View, Text } from 'react-native';

import { main_view } from '../../style';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={main_view}>
      <Text>Home Screen</Text>
    </View>
  );
};

export default HomeScreen;
