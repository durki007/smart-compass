import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState, useEffect } from 'react';
import FilesListComponent from './FilesListComponent';
import FooterNavg from '../FooterNavg';
import FilesHeader from './FilesHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook


const FilesScreen = () => {

    const [savedRoutes, setSavedRoutes] = useState([]);
    const isFocused = useIsFocused(); // Track whether the screen is focused

    const retrieveRoutes = async () => {
        try {
            const routeKeys = JSON.parse(await AsyncStorage.getItem('routeKeys')) || [];
            console.log('routeKeys: ', routeKeys);
            
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
            await retrieveRoutes();
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            console.log("Component is focused, fetching routes");
            retrieveRoutes(); // Fetch routes when the screen is focused
        }
    }, [isFocused]); // Run the effect whenever isFocused changes



    return(
        <View style={styles.container}>
            <FilesHeader 
                clearAllData={clearAllData}
            />
            <FilesListComponent 
                savedRoutes={savedRoutes}
                setSavedRoutes={setSavedRoutes}
            />
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