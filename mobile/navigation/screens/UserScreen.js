import * as React from 'react';
import { View, Text } from 'react-native';

import style from '../../style';

const UserScreen = ({ navigation }) => {
  return (
    <View style={style.main_view}>
      <Text onPress={() => navigation.navigate('Home')}>User Screen</Text>
    </View>
  );
};

export default UserScreen;
