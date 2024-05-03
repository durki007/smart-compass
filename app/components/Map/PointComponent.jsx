import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

/*
KNOWN BUGS:
  - dragging unselected marker causes details box to appear but taping somewhere else on the screen does not hide it




*/


const PointComponent = ({selectedMarker, handleDeletePoint, setSelectedMarker}) => {

  const [showPointDetails, setShowPointDetails] = useState(false);


  const animatedStyle = useAnimatedStyle(() => {
    const animatedHeight = showPointDetails ? withTiming(120) : withTiming(0);
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
          <Text>Latitude: {selectedMarker !== null ? selectedMarker.latitude : 'none'}</Text>
          <Text>Longitude: {selectedMarker !== null ? selectedMarker.longitude : 'none'}</Text>
          <Button title='Close' onPress={() => {closeDetailsBox()}}/>
          <Button title='Delete' onPress={() => {handleDeletePress()}} />
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
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#729294',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1, 
      },
    
})

export default PointComponent;