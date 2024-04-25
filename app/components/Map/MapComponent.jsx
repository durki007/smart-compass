import React, { useState } from 'react';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';



const MapComponent = ({ markersList, setMarkersList, handleMarkerAdding, handleMarkerDrag }) => {

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  let coordinates = markersList.map(marker => ({
    latitude: marker.latitude,
    longitude: marker.longitude
  }));


  const handleMarkerSelected = (id) => {
    setSelectedMarkerId(id);
  }

  const handleMarkerDeselected = () => {
    setSelectedMarkerId(null);
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
                showsBuildings
                showsMyLocationButton
                showsCompass 
                onLongPress={(e) => handleMarkerAdding(e.nativeEvent.coordinate)}
                // onMarkerSelect={(e) => handleMarkerSelected()}
                // onMarkerDeselect={() => handleMarkerDeselected()}

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
                    onPress={ (e) => handleMarkerSelected(marker.id)}
                  >
                    <Callout>
                      <View style={styles.calloutContainer}>
                        <Text>Informacje o położeniu markera:</Text>
                        <Text>Latitude: {marker.latitude}</Text>
                        <Text>Longitude: {marker.longitude}</Text>
                        <Button
                          title="Usuń"
                          onPress={() => console.log('Buttone deleted')}
                        />
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