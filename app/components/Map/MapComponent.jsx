import React, { useState } from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';


const MapComponent = () => {

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


  let coordinates = markersList.map(marker => ({
    latitude: marker.latitude,
    longitude: marker.longitude
  }));

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

  const handleMarkerSelected = () => {
    pass
  }

  const handleMarkerDeselected = () => {
    pass
  }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,

                }}
                mapType='terrain'
                showsBuildings = {true}       //not working???
                showsMyLocationButton = {true} //not working???
                showsCompass = {true}
                onLongPress={(e) => handleMarkerAdding(e.nativeEvent.coordinate)}
                onMarkerSelect={() => console.log('marker selected')}
                onMarkerDeselect={() => console.log('marker deselected')}

                >

              
              {markersList.map(marker => {
                return(
                  <Marker
                    draggable
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title={marker.title} 
                    onDragEnd={(e) => {
                      handleMarkerDrag(markersList.findIndex(item => item.id === marker.id), e.nativeEvent.coordinate);
                      console.log(markersList);
                    }}

                  />
                )
              })}

              <Polyline
                  coordinates={coordinates}
                  strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={6}
                />
            </MapView>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        width:'100%',
        height:'100%'
      },
      map: {
        width:'100%',
        height:'100%'
      },
    });
    

export default MapComponent;