import React from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity, Button } from 'react-native';
import { useFonts } from 'expo-font'

const SearchButton = () => {


    return(
        <Button style={styles.button} title= 'Serach for devices'/>
    );
}

export default SearchButton;


const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        backgroundColor: '#729294',
        height: 72,
        // paddingHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: -1, 
    }

})