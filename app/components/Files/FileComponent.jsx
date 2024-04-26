import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FileComponent = ({ name, date, num, thisRoute }) => {
  const [showButtons, setShowButtons] = useState(false);

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
        <TouchableOpacity onPress={() => {console.log('',thisRoute)}} style={[styles.button, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>CLog route</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('MapScreen', { thatRoute: thisRoute }); }} style={[styles.button, { backgroundColor: 'green' }]}> 
          <Text style={styles.buttonText}>Show on map</Text>
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
