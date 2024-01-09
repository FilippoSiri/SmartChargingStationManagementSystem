import * as React from 'react';
import { View, Text } from 'react-native';

const SearchScreen = ({ navigation }) => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Home')}>Search Screen</Text>
    </View>
  );
};

export default SearchScreen;
