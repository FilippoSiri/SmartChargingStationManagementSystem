import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import global_style from '../../style';

const RegistrationScreen = ({ navigation }) => {
  return (
    <View style={gloabl_style.main_view}>
      <View style={style.form_container}>
        <View style={style.field_container}>
          <Text>Name</Text>
          <TextInput style={style.text_input} />
        </View>
        <View style={style.field_container}>
          <Text>Surname</Text>
          <TextInput style={style.text_input} />
        </View>
        <View style={style.field_container}>
          <Text>Email</Text>
          <TextInput style={style.text_input} />
        </View>
        <View style={style.field_container}>
          <Text>Password</Text>
          <TextInput secureTextEntry={true} style={style.text_input} />
        </View>

        <View style={style.texts_container}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: global_style.main_color }}>
              I have already an account
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert('Registration')}
          style={style.btn}>
          <Text style={{ color: global_style.text_color_in_btn }}>
            Register now
          </Text>
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

export default RegistrationScreen;
