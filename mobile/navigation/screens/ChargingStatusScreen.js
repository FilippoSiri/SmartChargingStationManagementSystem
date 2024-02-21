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
            Alert.alert('Error', 'Error fetching user data');
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

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
                                    <Text style={style.info_bold}>Station id: </Text>
                                    <Text style={style.info}>{chargingInfo.station_id} </Text>
                                </View>
                                <View style={style.marginBottomStyle}>
                                    <Text style={style.info_bold}>Reservation time: </Text>
                                    <Text style={style.info}>{new Date(chargingInfo.reservation_time).toLocaleString()} </Text>
                                </View>
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
    }
});

export default ChargingStatusScreen;