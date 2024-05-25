import React from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity, Button } from 'react-native';
import { useFonts} from 'expo-font'
import prompt from 'react-native-prompt-android';



const MapHeader = ({saveCourse, newCourse}) => {

  const [loaded] = useFonts({
    RobotoBlack: require('../../assets/fonts/Roboto-Black.ttf'),
    RobotoMedium: require('../../assets/fonts/Roboto-Medium.ttf'),
  });


  if (!loaded) {
    return null;
  }

  const showPrompt = () => {
    prompt(
      'Enter Course Name',
      'Please enter the name of the course',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') , style: 'cancel' },
        { text: 'OK', onPress: (text) => saveCourse(text) },
      ],
      {
        type: 'plain-text',
        cancelable: false,
        defaultValue: '',
        placeholder: 'Course Name'
      }
    );
  };

  const handleSavePress = () => {
    console.log('perssed');
    showPrompt();
  }




  return (
      <View style ={styles.headerBox}>
        <View style={styles.headerLeftInnerBox}>
          <Text style={styles.headerText}>Map</Text>            
        
        </View>
        <View style={styles.headerRightInnerBox}>
          <Button title='Save' onPress={() => handleSavePress() }/>         
          <Button title='New' onPress={() => newCourse()}/>         
        </View>
      </View>
  );
}


const styles = StyleSheet.create({

  headerBox: {
    // flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor:'#B8D8D8',
    width:'100%',
    height: '15%',
    paddingTop: 30,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerLeftInnerBox: {
    flex: 1,
    flexDirection: 'column',
    height: 110,
    marginLeft: 12,
    marginTop: 20,
    marginBottom: 5,
  },

  headerText: {
    fontFamily: 'RobotoBlack',
    fontSize: 32,
  },

  headerRightInnerBox: {
    marginTop:10,
    width: 110,
  },

  headerImage: {
    height: 70,
    resizeMode: 'contain',
  },

})

export default MapHeader;