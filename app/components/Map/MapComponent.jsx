import React, { useState } from 'react';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';
import markerPng from './../../assets/marker.png'


const MapComponent = ({ markersList, setMarkersList, handleMarkerAdding, handleMarkerDrag, setSelectedMarker }) => {


  let coordinates = markersList.map(marker => ({
    latitude: marker.latitude,
    longitude: marker.longitude
  }));


  const handleMarkerSelected = (marker) => {
    markersList.map(el => {if(el.id == marker.id){
                          setSelectedMarker(el);
                          }});
    
  }

  const generateMarkerDesc = (index) => {
    if(index === 0) {
      return 'START'
    }
    if(index === markersList.length - 1) {
      return 'META'
    }
    return index + 1;
  }

  const handleMarkerDeselected = () => {
    console.log('unnn')
    setSelectedMarker(null);
  }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 51.10895471374126,
                longitude: 17.060079514398662,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,

                }}
                mapType='terrain'
                showsBuildings
                showsMyLocationButton
                showsCompass 
                onLongPress={(e) => handleMarkerAdding(e.nativeEvent.coordinate)}
                onMarkerSelect={(e) => handleMarkerSelected(e.nativeEvent)}
                onMarkerDeselect={() => handleMarkerDeselected()}

            >

              
              {markersList.map((marker, index) => {
                return(
                  <Marker
                    draggable
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    identifier={String(marker.id)}
                    title={marker.title}
                    // image={markerPng}  each marker should have its own png assigned base on its index
                    onDragEnd={(e) => {
                      handleMarkerDrag(markersList.findIndex(item => item.id == marker.id), e.nativeEvent.coordinate);
                      console.log(markersList);
                    }}
                  >
                    
                    <Callout >
                      <View style = {{ display:'flex' , justifyContent: 'center'}}>
                        <Text numberOfLines={1} ellipsizeMode="tail">{generateMarkerDesc(index)}</Text>
                      </View>
                    </Callout>

                  </Marker>
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