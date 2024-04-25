import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState } from 'react';
import MainContent from './MainContent';
import FooterNavg from '../FooterNavg';
import FilesHeader from './FilesHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FilesScreen = () => {

    const [savedRoutes, setSavedRoutes] = useState([]);


    const retrieveRoutes = async () => {
        try {
            const routeKeys = JSON.parse(await AsyncStorage.getItem('routeKeys')) || [];
            console.log('routeKeys: ',routeKeys);
            
            const routes = await Promise.all(routeKeys.map(async (key) => {
                const routeJson = await AsyncStorage.getItem(key);
                return JSON.parse(routeJson);
            }));
    
            console.log('Routes retrieved successfully:', routes);
            setSavedRoutes(routes); // Update savedRoutes with retrieved routes
        } catch (error) {
            console.error('Error retrieving routes:', error);
        }
    };

    const clearAllData = async () => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared successfully.');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };




    return(
        <View style={styles.container}>
            <FilesHeader 
            retrieveRoutes={retrieveRoutes}
            clearAllData={clearAllData}
            />
            <MainContent/>
            {/* <FooterNavg/> */}
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

export default FilesScreen;