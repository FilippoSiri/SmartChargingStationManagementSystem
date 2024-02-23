import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../AuthContext';

import { API_URL, API_PORT } from '@env';

import gloabl_style from '../../style';

import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';


const ChargingStatusScreen = () => {
    const { authToken, setAuthToken } = useContext(AuthContext);
    const [chargingInfo, setChargingInfo] = useState({});
    const [statusType, setStatusType] = useState('');
    const [station, setStation] = useState({});
    const isFocused = useIsFocused();

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`http://${API_URL}:${API_PORT}/user/last_usage`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${authToken}`,
                },
            });

            console.log(data);

            if (!data) {
                setStatusType('empty');
                return;
            }
            
            data.kw = data.kw.substr(0, 4);

            if (data.reservation_time && !data.start_time) 
                setStatusType('reservation');
            else if (data.start_time && !data.end_time)
                setStatusType('charging');
            else
                setStatusType('last');

            setChargingInfo(data);
        } catch (error) {
            Alert.alert('Error', error.response.data.message);
            console.error(error);
        }
    }

    useEffect(() => {

        const fetchData = async () => {
            try {
                console.log(chargingInfo.station_id);
                const res = await axios.get(`http://${API_URL}:${API_PORT}/station/${chargingInfo.station_id}`)

                setStation(res.data);
            } catch (error) {
                Alert.alert('Error', error.response.data.message);
            }
        }

        if (chargingInfo.id)
            fetchData();
    }, [chargingInfo]);

    useEffect(() => {
        fetchData();
    }, [isFocused]);

    return (
        <SafeAreaView style={gloabl_style.main_view}>
            <ScrollView style={{width: "100%"}}>
                <View style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <Text style={style.title}>Charging info</Text>
                </View>
                {
                    chargingInfo &&  (statusType === 'reservation' ? (
                        <>
                            <View style={style.info_container}>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Station: </Text>
                                    <Text style={style.info}>{station.name} </Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Reservation time: </Text>
                                    <Text style={style.info}>{new Date(chargingInfo.reservation_time).toLocaleString()} </Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Expiration time: </Text>
                                    <Text style={style.info}>{new Date(chargingInfo.expiration_time).toLocaleString()} </Text>
                                </View>

                                {
                                    new Date(chargingInfo.expiration_time) < new Date() &&
                                    <View style={style.expiration_text_container}>
                                        <Text style={style.expiration_text}>Reservation expired</Text>
                                    </View>
                                }

                            </View>
                        </>
                    ) : statusType === 'charging' ? (
                        <View style={style.info_container}>
                            <View style={style.marginBottomStyle}>
                                <Text style={style.info_bold}>Start time: </Text>
                                <Text style={style.info}>{new Date(chargingInfo.start_time).toLocaleString()} </Text>
                            </View>
                            <View style={style.marginBottomStyle}>
                                <Text style={style.info_bold}>Energy: </Text>
                                <Text style={style.info}>{chargingInfo.kw ?? "0.0"} Kwh</Text>
                            </View>
                            <View style={style.marginBottomStyle}>
                                <Text style={style.info_bold}>Price: </Text>
                                <Text style={style.info}>{(chargingInfo.kw ?? 0) * chargingInfo.price / 100} €</Text>
                            </View>
                        </View>
                    ) : statusType === "last" ? (
                            <View style={style.info_container}>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Start time:</Text>
                                    <Text style={style.info}>{new Date(chargingInfo.start_time).toLocaleString()} </Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>End time: </Text>
                                    <Text style={style.info}>{new Date(chargingInfo.end_time).toLocaleString() ?? "Not finish yet"} </Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Energy: </Text>
                                    <Text style={style.info}>{chargingInfo.kw ?? "0.0"} Kwh</Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Price: </Text>
                                    <Text style={style.info}>{(chargingInfo.kw ?? 0) * chargingInfo.price / 100} €</Text>
                                </View>
                            </View>
                    ) : (
                        <View>
                            <Text>No charging info</Text>
                        </View>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: gloabl_style.text_color
    },
    info_container: {
        width: "100%",
        display: "flex",
        marginTop: "10%"
    },
    info: {
        color: gloabl_style.text_color,
        fontSize: 18
    },
    info_bold: {
        color: gloabl_style.text_color,
        fontSize: 18,
        fontWeight: "bold"
    },
    marginBottomStyle: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 20
    },
    expiration_text_container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    expiration_text: {
        color: "red",
        fontSize: 24,
        fontWeight: "bold"
    }
});

export default ChargingStatusScreen;