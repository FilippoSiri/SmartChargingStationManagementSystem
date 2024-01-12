import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import global_style from '../../style';
import * as Keychain from 'react-native-keychain';
import { AuthContext } from '../AuthContext';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {setAuthToken} = useContext(AuthContext);

  const register = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      // Store the JWT Authentication token
      await Keychain.setGenericPassword('jwtToken', data);
      setAuthToken(data);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={gloabl_style.main_view}>
      <View style={style.form_container}>
        <View style={style.field_container}>
          <Text>Name</Text>
          <TextInput style={style.text_input} onChangeText={text => setName(text)} value={name} />
        </View>
        <View style={style.field_container}>
          <Text>Surname</Text>
          <TextInput style={style.text_input} onChangeText={text => setSurname(text)} value={surname} />
        </View>
        <View style={style.field_container}>
          <Text>Email</Text>
          <TextInput style={style.text_input} onChangeText={text => setEmail(text)} value={email} />
        </View>
        <View style={style.field_container}>
          <Text>Password</Text>
          <TextInput secureTextEntry={true} style={style.text_input} onChangeText={text => setPassword(text)} value={password} />
        </View>
        <View style={style.field_container}>
          <Text>Confirm Password</Text>
          <TextInput secureTextEntry={true} style={style.text_input} onChangeText={text => setConfirmPassword(text)} value={confirmPassword} />
        </View>

        <View style={style.texts_container}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: global_style.main_color }}>
              I have already an account
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => register()}
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
