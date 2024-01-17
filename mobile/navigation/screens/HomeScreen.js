import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from '../../components/map-template';
import gloabl_style from '../../style';

const HomeScreen = () => {
    const webRef = useRef();
    const [mapCenter, setMapCenter] = useState('8.93413, 44.40757');

    const onButtonPress = () => {
        const [lng, lat] = mapCenter.split(',');
        webRef.current.injectJavaScript(
            `  
                map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}]);
            `,
        );
    };

    const addMarker = (lng, lat, txt) => {
        webRef.current.injectJavaScript(
            `
                addMarker(${lng}, ${lat}, '${txt}');                
            `,
        );
    };

    const handleMapEvent = event => {
        /*let data = event.nativeEvent.data.split(',');
        addMarker(
            parseFloat(data[0]),
            parseFloat(data[1]),
            '<h1>Dopo Movimento</h1>',
        );*/
        setMapCenter(event.nativeEvent.data);
    };

    const loadStations = async () => {
        addMarker(8.93413, 44.40757, '<h1>Ciao</h1>');
        addMarker(8.93, 44.404, '<h1>Hello</h1>');
        addMarker(8.935, 44.405, '<h1>Pippo</h1>');
    }

    return (
        <View style={style.container}>
            <View style={style.buttons}>
                <TextInput
                    style={style.textInput}
                    onChangeText={setMapCenter}
                    value={mapCenter}></TextInput>
                <TouchableOpacity style={style.searchBtn} onPress={onButtonPress}>
                    <Text style={{ color: gloabl_style.text_color_in_btn }}>Search</Text>
                </TouchableOpacity>
            </View>
            <WebView
                ref={webRef}
                onMessage={handleMapEvent}
                style={style.map}
                originWhitelist={['*']}
                onLoadEnd={loadStations}
                source={{ html: mapTemplate }}/> 
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#fff',
    },
    buttons: {
        flexDirection: 'row',
        height: '15%',
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    textInput: {
        height: 40,
        width: '60%',
        margin: 16,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    map: {
        width: '100%',
        height: '85%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBtn: {
        backgroundColor: gloabl_style.main_color,
        padding: 10,
        borderRadius: 5,
        elevation: 5,
    },
});

export default HomeScreen;
