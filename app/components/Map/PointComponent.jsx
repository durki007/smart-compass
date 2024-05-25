import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

/*
KNOWN BUGS:
  - dragging unselected marker causes details box to appear but taping somewhere else on the screen does not hide it




*/


const PointComponent = ({selectedMarker, handleDeletePoint, setSelectedMarker}) => {

  const [showPointDetails, setShowPointDetails] = useState(false);


  const animatedStyle = useAnimatedStyle(() => {
    const animatedHeight = showPointDetails ? withTiming(130) : withTiming(0);
    return {
      height: animatedHeight,
    }
  })

  const closeDetailsBox = () => {
    setShowPointDetails(false);
  }

  const handleDeletePress = () => {
    handleDeletePoint(selectedMarker.id);
    closeDetailsBox();
    setSelectedMarker(null);
  }

  useEffect(() => {
    setShowPointDetails(selectedMarker !== null ? true : false);
  }, [selectedMarker]);

  return(
      <Animated.View style ={[styles.detailsBox, animatedStyle]}>
        <View style ={[styles.cordinatesBox]}>
          <Text style ={[styles.cordinatesText]}>Latitude: {selectedMarker !== null ? selectedMarker.latitude : 'none'}</Text>
          <Text style ={[styles.cordinatesText]}>Longitude: {selectedMarker !== null ? selectedMarker.longitude : 'none'}</Text>
        </View>
        <View style ={[styles.buttonsBox]}>
          <TouchableOpacity 
            style={[styles.utilButtons, { backgroundColor: '#CF6679' }]} 
            onPress={() => closeDetailsBox()}
          >
            <Text style={[{fontSize: 16, color: "#EEF5DB"}]}>Close</Text>
          </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.utilButtons, { backgroundColor: '#B00020' }]} 
            onPress={() => handleDeletePress()}
          >
            <Text style={[{fontSize: 16, color: "#EEF5DB"}]}>Delete</Text>
          </TouchableOpacity>
          
        </View>
        </Animated.View>

  );
}

const styles = StyleSheet.create({

    detailsBox: {
      
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        height: "20%",
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#2E2E2E',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1, 
      },

      cordinatesBox: {
        padding: 10,
      },
      
      buttonsBox: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      },

      utilButtons: {
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        // padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
      },

      cordinatesText: {
        fontSize: 16,
        color: "#EEF5DB"
      },

    
})

export default PointComponent;