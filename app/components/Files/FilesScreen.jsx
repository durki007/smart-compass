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
    const isFocused = useIsFocused();

    const retrieveRoutes = async () => {
        try {
            const routeKeys = JSON.parse(await AsyncStorage.getItem('routeKeys')) || [];
            // console.log('routeKeys: ', routeKeys);
            
            const routes = await Promise.all(routeKeys.map(async (key) => {
                const routeJson = await AsyncStorage.getItem(key);
                return { id: key, data: JSON.parse(routeJson) };
            }));
    
            // console.log('Routes retrieved successfully:', routes);
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

    const deleteRoute = async (routeId) => {
        try{
            await AsyncStorage.removeItem(routeId);
        
            // Retrieve current routeKeys from AsyncStorage and parse it from JSON
            const existingKeysJson = await AsyncStorage.getItem('routeKeys');
            const existingKeys = JSON.parse(existingKeysJson) || [];
            
            // Remove the deleted route's ID from the routeKeys array
            const updatedKeys = existingKeys.filter(key => key !== routeId);
            
            // Save the updated routeKeys back to AsyncStorage
            await AsyncStorage.setItem('routeKeys', JSON.stringify(updatedKeys));
            
            console.log('Route deleted successfully:', routeId);
            await retrieveRoutes();

        } catch (error) {
            console.error('Error deleting from AsyncStorage:', error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            retrieveRoutes();
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
                deleteRoute={deleteRoute}
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