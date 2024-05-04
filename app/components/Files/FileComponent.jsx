import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useBLE from '../Bluetooth/useBLE';



const FileComponent = ({ name, date, num, thisRoute, deleteRoute }) => {
  const [showButtons, setShowButtons] = useState(false);

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    sendMessage,
    checkConnection,
    serviceId,
  } = useBLE();

  const navigation = useNavigation();

  const handlePress = () => {
    setShowButtons(!showButtons);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const animatedHeight = showButtons ? withTiming(120) : withTiming(0);
    return {
      height: animatedHeight,
    }
  })

  const handleSendFile = (file) => {
    if(checkConnection()) {
      // console.log(serviceId);
      if (sendMessage(prepareFile(file))){
        console.log('Data sent successfuly');
      } else {
        console.log('error sending data.');
      }

    } else {
      console.log('No device connected!');
    }
  }

  const prepareFile = (file) => {
    // Extract data
    const markers = file.map(marker => [marker.latitude, marker.longitude]);
    const markerCount = markers.length;

    // Prepare for sending
    const totalFloats = markerCount * 2; 
    const dataToSend = new Float32Array(1 + totalFloats); 

    dataToSend[0] = markerCount;
    
    let offset = 1; // Start after the marker count
    markers.forEach(marker => {
        
        dataToSend[offset] = marker[0]; 
        dataToSend[offset + 1] = marker[1];
        offset += 2; // Move to the next marker
    });

    return dataToSend;
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Name: {name}</Text>
          <Text style={styles.text}>Date: {date}</Text>
          <Text style={styles.text}>Number of waypoints: {num}</Text>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <TouchableOpacity onPress={() => handleSendFile(thisRoute.data)} style={[styles.button, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>Send to device</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { thatRoute: thisRoute.data }); }} style={[styles.button, { backgroundColor: 'green' }]}> 
          <Text style={styles.buttonText}>Show on map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]}>
          <Text style={styles.buttonText} onPress={ () => deleteRoute(thisRoute.id)}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    overflow: 'hidden',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default FileComponent;
