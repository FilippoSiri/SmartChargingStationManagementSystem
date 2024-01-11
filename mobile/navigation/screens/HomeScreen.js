import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from '../../components/map-template';

import gloabl_style from '../../style';

const HomeScreen = () => {
  let webRef = undefined;
  let [mapCenter, setMapCenter] = useState('8.93413, 44.40757');

  const onButtonPress = () => {
    const [lng, lat] = mapCenter.split(',');
    webRef.injectJavaScript(
      `map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}])`,
    );
  };

  const addMarker = (lng, lat, txt) => {
    webRef.injectJavaScript(
      `
      addMarker(${lng}, ${lat}, '${txt}');
      `,
    );
  };

  const handleMapEvent = event => {
    let data = event.nativeEvent.data.split(',');
    addMarker(
      parseFloat(data[0]),
      parseFloat(data[1]),
      '<h1>Dopo Movimento</h1>',
    );
    setMapCenter(event.nativeEvent.data);
  };

  useEffect(() => {
    // addMarker(8.93413, 44.40757, '<h1>Ciao</h1>');
    // addMarker(8.93, 44.404, '<h1>Hello</h1>');
    // addMarker(8.935, 44.405, '<h1>Pippo</h1>');
  }, []);

  return (
    <View style={style.container}>
      <View style={style.buttons}>
        <TextInput
          style={style.textInput}
          onChangeText={setMapCenter}
          value={mapCenter}></TextInput>
        <Button title="Set Center" onPress={onButtonPress}></Button>
      </View>
      {/* <WebView
        ref={r => (webRef = r)}
        onMessage={handleMapEvent}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: mapTemplate }}></WebView> */}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    height: '15%',
    backgroundColor: '#fff',
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
  },
  map: {
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
