import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FileComponent = ({ name, date, num }) => {
  const [showButtons, setShowButtons] = useState(false);
  const buttonHeight = new Animated.Value(0);

  useEffect(() => {
    if (showButtons) {
      Animated.timing(buttonHeight, {
        toValue: 120, 
        duration: 300,         
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(buttonHeight, {
        toValue: 0, 
        duration: 300, 
        useNativeDriver: false,
      }).start();
    }
  }, [showButtons]);

  const handlePress = () => {
    setShowButtons(!showButtons);
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
      <Animated.View style={[styles.buttonContainer, { height: buttonHeight }]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]}>
          <Text style={styles.buttonText}>Button 3</Text>
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
