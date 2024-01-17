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
import axios from 'axios';
import { API_URL, API_PORT } from '../../config';

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

    const addMarker = (lng, lat, id, txt) => {
        webRef.current.injectJavaScript(
            `
                addMarker(${lng}, ${lat}, ${id}, '${txt}');                
            `,
        );
    };

    const handleDragMap = (data) => {
        setMapCenter(`${data.lon}, ${data.lat}`);
    }

    const handleClickMarker = (data) => {
        console.log(data);
    }

    const handleMapEvent = event => {
        const data = JSON.parse(event.nativeEvent.data);
        if(data.type === 'drag_map'){
            handleDragMap(data);
        }else if(data.type === 'marker_click'){
            handleClickMarker(data);
        }
    };

    const loadStations = async () => {
        try {
            axios
                .get(
                    `http://${API_URL}:${API_PORT}/station`,
                    { headers: { 'Content-Type': 'application/json' } },
                )
                .then(async response => {
                    response.data.forEach(station => {
                        addMarker(station.lon, station.lat, station.id, `<h1>${station.name}</h1>`);
                    });
                })
                .catch(error => {
                    throw new Error('Loading stations failed');
                });
        } catch (error) {
            console.error('Error:', error);
        }
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
