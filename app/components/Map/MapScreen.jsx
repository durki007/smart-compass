import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useEffect, useState } from 'react';
import MapHeader from './MapHeader';
import MapComponent from './MapComponent';
import PointComponent from './PointComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const MapScreen = () => {


    const navigation = useNavigation();
    const route = useRoute();
    
    const [selectedMarker, setSelectedMarker] = useState(null);


    useEffect(() => {
        const routeToDisplay = route.params?.thatRoute;
        if (routeToDisplay != null) {
            setMarkersList(routeToDisplay);
        }
        console.log(markersList);
    }, [route.params?.thatRoute]);

    const [markersList, setMarkersList] = useState([
        {
          id:1,
          latitude: 51.10895471374126,
          longitude: 17.060079514398662,
          title: 'Marker 1'
        },
        {
          id:2,
          latitude: 51.10744078549627,
          longitude: 17.06103398066831,
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
        setSelectedMarker(updatedMarkersList[index]);
    };
    
    
    const handleMarkerAdding = (newPointCoordinate) => {
        const updatedMarkersList = [...markersList];
        const lastMarker = updatedMarkersList.slice(-1)[0];  
        updatedMarkersList.push({ 
            id: lastMarker !== undefined ? lastMarker.id + 1 : 1,
            latitude: newPointCoordinate.latitude, 
            longitude: newPointCoordinate.longitude 
        });
        setMarkersList(updatedMarkersList);
    }

    const handleDeletePoint = (markerToDeleteId) => {
        const markerIndex = markersList.findIndex(item => item.id === markerToDeleteId);
        if (markerIndex !== -1) { // Check if markerIndex is found
            const updatedMarkersList = [...markersList]; // Create a copy of the markers list
            updatedMarkersList.splice(markerIndex, 1); // Remove the marker at markerIndex
            setMarkersList(updatedMarkersList); // Update the state with the new list
        } else {
            console.error(`Marker with ID ${markerToDeleteId} not found.`);
        }
    };
    


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
                setSelectedMarker={setSelectedMarker}
            />
            <PointComponent
                selectedMarker={selectedMarker}
                handleDeletePoint = {handleDeletePoint}
                setSelectedMarker = {setSelectedMarker}
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

export default MapScreen;