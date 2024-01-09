import * as React from 'react';
import { View, Text } from 'react-native';

import { main_view } from '../../style';

const SearchScreen = ({ navigation }) => {
  return (
    <View style={main_view}>
      <Text onPress={() => navigation.navigate('Home')}>Search Screen</Text>
    </View>
  );
};

export default SearchScreen;
