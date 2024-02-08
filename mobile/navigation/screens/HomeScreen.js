import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from '../../components/map-template';
import gloabl_style from '../../style';
import axios from 'axios';
import { API_URL, API_PORT } from '@env';
import BottomSheet, {  BottomSheetModal } from '@gorhom/bottom-sheet';
import { AuthContext } from '../AuthContext';
import { Base64 } from 'js-base64';

import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const stationStatusColor = {
    0: '#085C13',
    1: '#ffa500',
    2: '#ff0000',
    4: '#000000',
    5: '#000000',
};

const HomeScreen = () => {
    const { authToken, setAuthToken } = useContext(AuthContext);
    const [decodedToken, setDecodedToken] = useState(null);
    const webRef = useRef();
    const [stationId, setStationId] = useState(null);
    const [stationInfo, setStationInfo] = useState({});
    const [lastStationUsage, setLastStationUsage] = useState({});
    const [lastStationReservation, setLastStationReservation] = useState({});
    const [isActionPerformedz, setIsActionPerformed] = useState(false);
    const snapPoints = useMemo(() => ['65%', '30%'], []);
	const bottomSheetRef = useRef(null);

    const updatePosition = (position) => {
        webRef.current.injectJavaScript(
            `  
                setCenter(${position.coords.longitude}, ${position.coords.latitude});                
            `
        );
    }

    const loadPosition = () => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        getOneTimeLocation();
                        subscribeLocationLocation();
                    } 
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        requestLocationPermission();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    };
    
    
    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            updatePosition,
            (error) => console.warn(error.message), {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };
    
    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            updatePosition,
            (error) => console.warn(error.message), {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };

    const addMarker = (lng, lat, id, color) => {
        webRef.current.injectJavaScript(
            `
                addMarker(${lng}, ${lat}, ${id}, '${color}');                
            `,
        );
    };

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
                
            setStationInfo(res.data);
            setStationId(data.id);

            if (res.data.status === 1) {
                console.log('last reservation');
                const res2 = await axios.get(
                    `http://${API_URL}:${API_PORT}/station/${data.id}/last_reservation`,
                    { headers: { 'Content-Type': 'application/json' } });

                console.log(res2.data);
                setLastStationReservation(res2.data);
            } else if (res.data.status === 2) {
                const res2 = await axios.get(
                    `http://${API_URL}:${API_PORT}/station/${data.id}/last_usage`,
                    { headers: { 'Content-Type': 'application/json' } });

                console.log(res2.data);
                setLastStationUsage(res2.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleMapEvent = event => {
        const data = JSON.parse(event.nativeEvent.data);
        if(data.type === 'marker_click'){
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
                        if (!station.dismissed)
                            addMarker(station.lon, station.lat, station.id, stationStatusColor[station.status]);
                    });
                })
                .catch(error => {
                    throw new Error('Loading stations failed');
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const loadMap = () => {
        loadStations();
        loadPosition();
    }

    const handleReserveClick = async () => {
        try {
            const res = await axios.post(
                `http://${API_URL}:${API_PORT}/station/${stationId}/reserve/`,
                { }  , { 
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: authToken,
                    } 
                },
            );
            console.log(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleStartCharging = async () => {
        try {
            const res = await axios.post(
                `http://${API_URL}:${API_PORT}/station/${stationId}/start_charging/`,
                { }, { 
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: authToken,
                    } 
                },
            );
            console.log(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleStopCharging = async () => {
        try {
            const res = await axios.post(
                `http://${API_URL}:${API_PORT}/station/${stationId}/stop_charging/`,
                { }, { 
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: authToken,
                    } 
                },
            );
            console.log(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (authToken) {
            const decodedToken = JSON.parse(Base64.decode(authToken.split('.')[1]));
            setDecodedToken(decodedToken);
        }
    }, []);

    return (
        <SafeAreaView style={style.container}> 
      
           <WebView
                ref={webRef}
                onMessage={handleMapEvent}
                style={style.map}
                originWhitelist={['*']}
                onLoadEnd={loadMap}
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
                                <Text style={style.itemGridText}>{stationInfo.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                { stationInfo.status === 0 && (
                    <View style={style.buttonsContainer}>
                        <View style={style.displayGridBtns}>
                            <TouchableOpacity onPress={handleStartCharging} style={style.modalBtns}>
                                <View >  
                                    <Text style={{color: "#fff"}}>Avvia</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReserveClick} style={style.modalBtns}>
                                <View >  
                                    <Text style={{color: "#fff"}}>Prenota</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {
                    stationInfo.status == 2 && lastStationUsage !== null && lastStationUsage.user_id == decodedToken.userId && (
                        <View style={style.buttonsContainer}>
                            <View style={style.displayGridBtns}>
                                <TouchableOpacity onPress={handleStopCharging} style={style.modalBtns}>
                                    <View >  
                                        <Text style={{color: "#fff"}}>Termina</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                )}

                {
                    stationInfo.status == 1 && lastStationReservation !== null && lastStationReservation.user_id == decodedToken.userId && (
                        <View style={style.buttonsContainer}>
                            <View style={style.displayGridBtns}>
                                <TouchableOpacity onPress={handleStartCharging} style={style.modalBtns}>
                                    <View >  
                                        <Text style={{color: "#fff"}}>Annulla prenotazione</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                )}
            
            </BottomSheetModal>
                
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '85%',
        alignItems: 'center',
        justifyContent: 'center',
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
