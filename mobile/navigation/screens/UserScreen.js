import React, { useContext } from 'react';
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

import gloabl_style from '../../style';

const UserScreen = ({ navigation }) => {
    const { setAuthToken } = useContext(AuthContext);

    const logout = async () => {
        await Keychain.resetGenericPassword();
        setAuthToken(null);
    };

    return (
        <View style={gloabl_style.main_view}>
            <View style={style.form_container}>
                <TouchableOpacity onPress={() => logout()} style={style.btn}>
                    <Text style={{ color: gloabl_style.text_color_in_btn }}>Logout</Text>
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

export default UserScreen;
