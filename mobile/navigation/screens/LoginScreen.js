import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { API_URL, API_PORT } from '@env';

import gloabl_style from '../../style';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthToken } = useContext(AuthContext);

    const login = async () => {
        console.log(`http://${API_URL}:${API_PORT}/auth/login`);
        try {
            axios
                .post(
                    `http://${API_URL}:${API_PORT}/auth/login`,
                    JSON.stringify({ email, password }),
                    { headers: { 'Content-Type': 'application/json' } },
                )
                .then(async response => {
                    const data = response.data;
                    // Store the JWT Authentication token
                    await Keychain.setGenericPassword('jwtToken', data.token);
                    setAuthToken(data.token);
                })
                .catch(error => {
                    throw new Error('Login failed');
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={gloabl_style.main_view}>
            <View style={style.form_container}>
                <View style={style.field_container}>
                    <Text>Email</Text>
                    <TextInput style={style.text_input} onChangeText={text => setEmail(text)} value={email} />
                </View>
                <View style={style.field_container}>
                    <Text>Password</Text>
                    <TextInput secureTextEntry={true} style={style.text_input} onChangeText={text => setPassword(text)} value={password} />
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

                <TouchableOpacity onPress={() => login()} style={style.btn}>
                    <Text style={{ color: gloabl_style.text_color_in_btn }}>Login</Text>
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
