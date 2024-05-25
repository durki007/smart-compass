import React from 'react';
import { StyleSheet, Text, Alert, View, Image, TouchableOpacity } from 'react-native';

const FooterNavg = () => {

    
    return (
      //   <View style={styles.navBar}>
      //   <TouchableOpacity style={styles.navBarButton} >
      //     <Image source={require('../assets/setting.png')} style={styles.navBarImage} />
      //   </TouchableOpacity>
      //   <TouchableOpacity style={styles.navBarButton}>
      //     <Image source={require('../assets/compass.png')} style={styles.navBarImage} />
      //   </TouchableOpacity>
      //   <TouchableOpacity style={styles.navBarButton}>
      //     <Image source={require('../assets/files.png')} style={styles.navBarImage} />
      //   </TouchableOpacity>
      // </View>
      <View></View>
    );

}

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#729294',
        height: 72,
        // paddingHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1, 
      },
    
      navBarButton: {
        flex: 1,
        width: '33%', 
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
      },
      navBarImage: {
        height: 36,
        width: '33%',
        resizeMode: 'contain',
      },

})

export default FooterNavg;