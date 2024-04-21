import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState } from 'react';
import MapHeader from './MapHeader';
import MapComponent from './MapComponent';
import PointComponent from './PointComponent';

const MapScreen = () => {
    return(
        <View style={styles.container}>
            <MapHeader/>
            <MapComponent/>
            {/* <PointComponent/> */}
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B4B4B',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

})

export default MapScreen;