import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState } from 'react';
import MapHeader from './MapHeader';
import MapComponent from './MapComponent';
import PointComponent from './PointComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MapScreen = () => {

    const [markersList, setMarkersList] = useState([
        {
          id:1,
          latitude: 37.78825,
          longitude: -122.4324,
          title: 'Marker 1'
        },
        {
          id:2,
          latitude: 37.68825,
          longitude: -122.3324,
          title: 'Marker 2'
        },
    ])

    


    const handleMarkerDrag = (index, newCoordinate) => {
        const updatedMarkersList = [...markersList];
        updatedMarkersList[index] = {
            ...updatedMarkersList[index],
            latitude: newCoordinate.latitude, 
            longitude: newCoordinate.longitude
        };
        setMarkersList(updatedMarkersList);
    };
    
    
    const handleMarkerAdding = (newPointCoordinate) => {
        const updatedMarkersList = [...markersList];
        const lastMarker = updatedMarkersList.slice(-1)[0];  
        updatedMarkersList.push({ 
            id: lastMarker.id + 1,
            latitude: newPointCoordinate.latitude, 
            longitude: newPointCoordinate.longitude 
        });
        setMarkersList(updatedMarkersList);
    }


    const saveCourse = async () => {
        console.log(markersList);
        const routeJson = JSON.stringify(markersList);
    
        try {
            const uniqueId = Date.now().toString(); // Generate a unique ID for the route
            try {
                await AsyncStorage.setItem(uniqueId, routeJson);                
            } catch (error) {
                console.error('Error saving inner route:', error);
            }
    
            // Retrieve current routeKeys and parse it from JSON
            const existingKeysJson = await AsyncStorage.getItem('routeKeys');
            const existingKeys = JSON.parse(existingKeysJson) || [];
    
            // Update routeKeys with the new uniqueId and save it back to AsyncStorage
            const updatedKeys = [...existingKeys, uniqueId];
            await AsyncStorage.setItem('routeKeys', JSON.stringify(updatedKeys));
    
            displaySuccessPrompt();
    
            console.log('Route saved successfully.');
        } catch (error) {
            console.error('Error saving route:', error);
        }
    };

    const displaySuccessPrompt = () => {
        Alert.alert(
            'Success',
            'Markers list saved successfully!',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    };

    return(
        <View style={styles.container}>
            <MapHeader saveCourse={saveCourse} />
            <MapComponent
                markersList={markersList}
                setMarkersList={setMarkersList}
                handleMarkerAdding={handleMarkerAdding}
                handleMarkerDrag={handleMarkerDrag}
            />
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