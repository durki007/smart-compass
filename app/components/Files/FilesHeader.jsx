import React, { useState } from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity, Button } from 'react-native';
import { useFonts } from 'expo-font'




const FilesHeader = ({retrieveRoutes, clearAllData}) => {

    const [loaded] = useFonts({
        RobotoBlack: require('../../assets/fonts/Roboto-Black.ttf'),
        RobotoMedium: require('../../assets/fonts/Roboto-Medium.ttf'),
      });
    
    
      if (!loaded) {
        return null;
      }
    

    return (
        <View style ={styles.headerBox}>
            <View style={styles.headerLeftInnerBox}>
                <Text style={styles.headerText}>Saved tracks</Text>
            </View>
               <View style={styles.headerRightInnerBox}>
                <TouchableOpacity 
                  style={[styles.utilButtons, { backgroundColor: '#CF6679' }]} 
                  onPress={() => clearAllData()}
                >
                  <Text style={[{fontSize: 16, color: "#EEF5DB"}]}>DELETE ALL</Text>
                </TouchableOpacity>
                
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
        backgroundColor:'#2D2D2D',
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
        marginLeft:12,
        marginTop:15,
        marginBottom: 5,
      },
    
      headerText: {
        fontFamily: 'RobotoBlack',
        fontSize: 32,
        color:'#6200EE',
      },
    
      headerRightInnerBox: {
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:10,
        width: 110,
      },
    
      headerImage: {
        height: 70,
        resizeMode: 'contain',
      },

      utilButtons: {
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        padding: 10,
        borderRadius: 10,
      }

})

export default FilesHeader;