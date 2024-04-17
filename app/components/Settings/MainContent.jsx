import React from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'

const MainContent = () => {


    return (
        <View style={styles.mainBox}>
          <Text style={styles.mainBoxSmallText}>Bluetooth connection</Text>
          <Text style={styles.mainBoxSmallText}>Lorem Ipsum</Text>
          <Text style={styles.mainBoxSmallText}>SmartCompass</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    mainBox: {
        flexDirection: 'column',
        flex:1,
        width: '90%',
        borderRadius: 20,
        backgroundColor: '#EEF5DB',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 30,
        marginBottom:30,
        marginTop:30
      },
    
      mainBoxSmallText: {
        fontFamily:'RobotoMedium',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      },
    
      mainBoxBigText: {
        fontFamily:'RobotoMedium',
        fontSize: 24,
        marginBottom: 20,
    
      },

})

export default MainContent;