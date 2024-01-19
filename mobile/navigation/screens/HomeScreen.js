import React, { useState, useRef, useMemo } from 'react';
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
import { API_URL, API_PORT } from '@env';
import BottomSheet, {  BottomSheetModal } from '@gorhom/bottom-sheet';

const stationStatusColor = {
    0: '#00ff00',
    1: '#ffa500',
    2: '#ff0000',
    4: '#000000',
    5: '#000000',
};

const HomeScreen = () => {
    const webRef = useRef();
    const [mapCenter, setMapCenter] = useState('8.93413, 44.40757');
    const [stationId, setStationId] = useState(null);
    const [stationInfo, setStationInfo] = useState({});
    const snapPoints = useMemo(() => ['65%', '30%'], []);
	const bottomSheetRef = useRef(null);

    const onButtonPress = () => {
        const [lng, lat] = mapCenter.split(',');
        webRef.current.injectJavaScript(
            `  
                map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}]);
            `,
        );
    };

    const addMarker = (lng, lat, id, color) => {
        console.log(`addMarker(${lng}, ${lat}, ${id}, '${color}')`);
        webRef.current.injectJavaScript(
            `
                addMarker(${lng}, ${lat}, ${id}, '${color}');                
            `,
        );
    };

    const handleDragEndMap = (data) => {
        setMapCenter(`${data.lon}, ${data.lat}`);
    }

    const handleDragStartMap = (data) => {
        bottomSheetRef.current.snapToIndex(1);
    }

    const handleClickMarker = async (data) => {
        setStationId(data.id);
        bottomSheetRef.current?.present();
        bottomSheetRef.current.snapToIndex(0);

        try {
            const res = await axios.get(
                `http://${API_URL}:${API_PORT}/station/${data.id}`,
                { headers: { 'Content-Type': 'application/json' } });
                
            console.log(res.data);
            setStationInfo(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleMapEvent = event => {
        const data = JSON.parse(event.nativeEvent.data);
        if(data.type === 'drag_map'){
            handleDragEndMap(data);
        }else if(data.type === 'marker_click'){
            handleClickMarker(data);
        }else if(data.type === 'drag_start'){
            handleDragStartMap(data);
        } else if (data.type === 'debug') {
            console.log(data.message);
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
                        if (!station.dismissed){
                            console.log(station);
                            console.log(stationStatusColor[station.status]);
                            addMarker(station.lon, station.lat, station.id, stationStatusColor[station.status]);
                        }
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
            
            <BottomSheetModal
				ref={bottomSheetRef}
				index={0}
                initialSnap={1}
				snapPoints={snapPoints}
				enablePanDownToClose={true}>

                <View style={style.stationInfoContainer}>
                    <Text style={style.titleText}>{stationInfo.name}</Text>
                    <View style={style.displayGrid}>
                        <View style={style.itemGridContainer}>  
                            <Text style={style.itemGridTextTitle}>Power</Text>
                            <Text style={style.itemGridText}>{(Math.round(stationInfo.power * 100) / 100).toFixed(2)}</Text>
                        </View>
                        <View style={style.itemGridContainer}>  
                            <Text style={style.itemGridTextTitle}>Price</Text>
                            <Text style={style.itemGridText}>{stationInfo.price / 100}</Text>
                        </View>
                        <View style={{marginTop: 16, height: 150}}>
                            <View style={style.itemGridContainer}>  
                                <Text style={style.itemGridTextTitle}>Description</Text>
                                <Text style={style.itemGridText}>{stationInfo.description ?? "Questa è una descrizione temporanea\nQuesta è una descrizione temporanea\nQuesta è una descrizione temporanea\nQuesta è una descrizione temporanea\nQuesta è una descrizione temporanea"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                        { stationInfo.status === 0 && (
                <View style={style.buttonsContainer}>
                    <View style={style.displayGridBtns}>
                                <TouchableOpacity style={style.modalBtns}>
                                    <View >  
                                        <Text style={{color: "#fff"}}>Avvia</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.modalBtns}>
                                    <View >  
                                        <Text style={{color: "#fff"}}>Prenota</Text>
                                    </View>
                                </TouchableOpacity>
                    </View>
                    
                </View>
                        )}
            
            </BottomSheetModal>
                
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
    stationInfoContainer: {
        paddingHorizontal: 48,
        paddingVertical: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
    },
    displayGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',   
    },
    displayGridBtns: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',   
    },
    itemGridContainer: {
        marginTop: 16,
    },
    itemGridTextTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    itemGridText: {
        fontSize: 16,
    },
    buttonsContainer: {
        paddingHorizontal: 48,
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    modalBtns: {
        width: '40%',
        height: 50,
        backgroundColor: gloabl_style.main_color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        borderRadius: 5,
    }
});

export default HomeScreen;
