import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import gloabl_style from '../../style';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={gloabl_style.main_view}>
      <View style={style.form_container}>
        <View style={style.field_container}>
          <Text>Email</Text>
          <TextInput style={style.text_input} />
        </View>
        <View style={style.field_container}>
          <Text>Password</Text>
          <TextInput secureTextEntry={true} style={style.text_input} />
        </View>

        <View style={style.texts_container}>
          <TouchableOpacity>
            <Text style={{ color: gloabl_style.main_color }}>
              Forgot password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={{ color: gloabl_style.main_color }}>
              Register here
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Ciao')} style={style.btn}>
          <Text style={{ color: 'black' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  form_container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  field_container: {
    width: '80%',
    margin: 15,
  },
  text_input: {
    height: 40,
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 5,
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: 50,
    backgroundColor: gloabl_style.main_color,
    marginTop: 35,
    borderRadius: 5,
    elevation: 5,
  },
  texts_container: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LoginScreen;
