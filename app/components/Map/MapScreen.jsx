import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useEffect, useState } from 'react';
import MapHeader from './MapHeader';
import MapComponent from './MapComponent';
import PointComponent from './PointComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SequencedTransition } from 'react-native-reanimated';

const MapScreen = () => {


    const navigation = useNavigation();
    const route = useRoute();

    const [editedRoute, setEditedRoute] = useState(null); // stores passed course from files
    
    const [selectedMarker, setSelectedMarker] = useState(null);

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

    useEffect(() => {
        const routeToDisplay = route.params?.thatRoute.data.markers;
        if (routeToDisplay != null) {
            setMarkersList(routeToDisplay);
            setEditedRoute(route.params.thatRoute);
            console.log(routeToDisplay);
        }
    }, [route.params?.thatRoute]);


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
        if(updatedMarkersList.length !== 100){
            const lastMarker = updatedMarkersList.slice(-1)[0];  
            updatedMarkersList.push({ 
                id: lastMarker !== undefined ? lastMarker.id + 1 : 1,
                latitude: newPointCoordinate.latitude, 
                longitude: newPointCoordinate.longitude 
            });
            setMarkersList(updatedMarkersList);
        } else {
            displayPrompt("Warning!", "Limit of points has been reached. Cannot add new point!");
        }

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
    
    const newCourse = () => {
        setEditedRoute(null);
        setMarkersList([]);
        setSelectedMarker(null);
    }

    const saveCourse = async (name) => {

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

        const routeData = {
            name: name,
            date: formattedDate,
            markers: markersList,
            length: markersList.length
        };

        const routeJson = JSON.stringify(routeData);


        // checking if user is editing existing route, and if this route exists in storage.
        // in some cases route can be still drawn on the map but already erased from storage
    
        if (editedRoute !== null && await AsyncStorage.getItem(editedRoute.id) !== null) {  

            try {
                
                await AsyncStorage.setItem(editedRoute.id, routeJson);
                let temp = editedRoute;
                temp.data = routeData;
                setEditedRoute(temp);    

                displayPrompt('Success', 'Course saved, old version overwritten.');

            } catch (error) {
                console.error('Error overwritting existing route', error);
            }

            

        } else {
            

            try {
                const uniqueId = Date.now().toString(); // Generate a unique ID for the route

                try {
                    await AsyncStorage.setItem(uniqueId, routeJson);                
                } catch (error) {
                    console.error('Error saving inner route:', error);
                }

                // saving this route in editedRoute for further editing
                temp = {id: uniqueId, data: routeData};
                setEditedRoute(temp);
        
                // Retrieve current routeKeys and parse it from JSON
                const existingKeysJson = await AsyncStorage.getItem('routeKeys');
                const existingKeys = JSON.parse(existingKeysJson) || [];
        
                // Update routeKeys with the new uniqueId and save it back to AsyncStorage
                const updatedKeys = [...existingKeys, uniqueId];
                await AsyncStorage.setItem('routeKeys', JSON.stringify(updatedKeys));
        
                displayPrompt('Success', 'Course saved.');
        
            } catch (error) {
                console.error('Error saving route:', error);
            }
        }
        
        
    };

    const displayPrompt = (promptTitle, promptText) => {
        Alert.alert(
            promptTitle,
            promptText,
            [{ text: 'OK'}]
        );
    };

    return(
        <View style={styles.container}>
            <MapHeader saveCourse={saveCourse} newCourse={newCourse} />
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