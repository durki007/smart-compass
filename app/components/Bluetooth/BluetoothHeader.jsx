import React from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'




const BluetoothHeader = ({ connectionStatus }) => {

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
            <Text style={styles.headerText}>Bluetooth</Text>            
            <Text style={connectionStatus ? styles.headerConnected : styles.headerDisconnected}>
            Status: {connectionStatus ? 'connected' : 'disconnected'}
            </Text>

          </View>
          <View style={styles.headerRightInnerBox}>
            <Image source={require('../../assets/bluetooth.png')} style={styles.headerImage} />
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
        paddingTop: 20,
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
        marginTop:5,
        marginBottom: 5,
      },
    
      headerText: {
        fontFamily: 'RobotoBlack',
        fontSize: 32,
      },
    
      headerConnected: {
        fontFamily: 'RobotoBlack',
        fontSize: 24,
        color: '#009933', //  "connected" colour
      },
    
      headerDisconnected: {
        fontFamily: 'RobotoBlack',
        fontSize: 24,
        color: '#F00', // "disconnected" colour
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

export default BluetoothHeader;