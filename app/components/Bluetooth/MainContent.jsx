import React, {useEffect, useState, useRef} from 'react';
import { Modal, StyleSheet, Text, Alert, View, Image, PermissionsAndroid, TouchableOpacity, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx'
import RNFS, {DocumentDirectoryPath, writeFile} from 'react-native-fs';
import useBLE from './useBLE';
import { useFonts } from 'expo-font'
import SearchButton from './SearchButton';



import { MaterialIcons } from '@expo/vector-icons';





const MainContent = (props) => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [tempDevice, setTempDevice] = useState(null);

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    sendMessage
  } = useBLE();


  const scanForDevices = () => {
    requestPermissions(isGranted => {
      console.log('permison granted');
      if (isGranted) {
        scanForPeripherals();
        console.log("After scanning ")
      }
    });
  };

  const openModal = (device) => {
    setTempDevice(device);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleConnect = () => {
    connectToDevice(tempDevice);
    setTempDevice(null);
    hideModal();
    if (connectedDevice) {
      props.changeConnectionStatus(true);
      console.log('Połączono z urządzeniemmmmmm: ', connectedDevice.name);
    }
  };

  const handleDisconnect = () => {
    disconnectFromDevice();

    if (!connectedDevice) {
      props.changeConnectionStatus(false);
      console.log('Connection closed!!');
    }
  }

  const handleConnectToDevice = (device) => {
    openModal(device);
  };

  const  handleCheckConnection = async () => {
    if (connectedDevice) {
      const isConnected = await connectedDevice.isConnected();
      if (isConnected) {
        console.log('Urządzenie jest nadal połączone.');
        console.log(connectedDevice.id)
      } else {
        console.log('Urządzenie nie jest już połączone.');
      }
    } else {
      console.log('Nie ma połączonego urządzenia.');
    }
  }
  

 const handelSendFile = () => {

  sendMessage();
 }

  return (
    <View style={styles.mainBox}>
      <Text style={styles.mainBoxBigText}>Nearby devices:</Text>
      <View style={styles.devicesList}>
        {allDevices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={styles.deviceBox}
            onPress={() => handleConnectToDevice(device)} 
          >
            <Text style={styles.deviceText}>{device.name}</Text>
            <MaterialIcons name="keyboard-arrow-right" size={30} />
          </TouchableOpacity>
        ))}
      </View>
      <Button styles={styles.utilButtons} title='SCAN' onPress={()=>scanForDevices()}/>
      <Button title='SEND' onPress={()=>handelSendFile()}/>
      <Button title='CHECK CONNECTION' onPress={()=>handleCheckConnection()}/>
      <Button title='DISCONNECT' onPress={()=>handleDisconnect()}/>


      {isModalVisible && (
        <Modal>
          <View style={styles.modalBox}>
            <Text>Czy na pewno chcesz połączyć się z {tempDevice.name}?</Text>
            <View style={styles.buttonsBox}>
              <Button style={styles.modalButton} title="TAK" onPress={handleConnect} />
              <Button style={styles.modalButton} title="NIE" onPress={hideModal} />
            </View>
            
          </View>
        </Modal>
      )}
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

    deviceBox: {

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,

      paddingBottom:10,
      paddingLeft:30,
      paddingRight: 30,
      borderBottomWidth: 1,
    },

    deviceText: {
      fontFamily:'RobotoMedium',
      fontSize: 16,
    },

    modalBox: {
      backgroundColor: '#729294',
      padding: 30,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    buttonsBox: {
      flexDirection: 'row',
      alignItems: 'space-between'
    },

    modalButton: {
      borderRadius: 20,
      padding: 40,
    },

    utilButtons: {
      margin: 20,
      borderRadius: 10,
    },

})

export default MainContent;