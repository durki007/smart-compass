import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState, useEffect } from 'react';
import BluetoothHeader from './BluetoothHeader';
import MainContent from './MainContent';
import FooterNavg from '../FooterNavg';
import SearchButton from './SearchButton';
import useBLE from './useBLE';

const BluetoothScreen = () => {

    const [isConnected, setIsConnected] = useState(false);

    return(
        <View style={styles.container}>
            <BluetoothHeader connectionStatus={isConnected} />
            <MainContent changeConnectionStatus = {isConnected => setIsConnected(isConnected)}/>
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

export default BluetoothScreen;