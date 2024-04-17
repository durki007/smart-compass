import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'
import React, { useState } from 'react';
import MainContent from './MainContent';
import FooterNavg from '../FooterNavg';
import FilesHeader from './FilesHeader';

const FilesScreen = () => {
    return(
        <View style={styles.container}>
            <FilesHeader/>
            <MainContent/>
            {/* <FooterNavg/> */}
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B4B4B',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

})

export default FilesScreen;