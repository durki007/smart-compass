import React, {useEffect, useState, useRef, useContext} from 'react';
import { Modal, StyleSheet, Text, Alert, View, Image, PermissionsAndroid, TouchableOpacity, Button } from 'react-native';
import useBLE from './useBLE';
import { useFonts } from 'expo-font'
import SearchButton from './SearchButton';
import { BLEContext } from '../BLEProvider';



import { MaterialIcons } from '@expo/vector-icons';


const MainContent = (props) => {

  const {
    serviceId,
    setServiceId,
    caracId,
    setCaradId,
    allDevices,
    setAllDevices,
    connectedDevice,
    setConnectedDevice,
    deviceId,
    setDeviceId,
  } = useContext(BLEContext);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [tempDevice, setTempDevice] = useState(null);

  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    sendMessage,
    checkConnection,
  } = useBLE();


  useEffect(() => {
    if(connectedDevice === null || connectedDevice === undefined) {
      props.changeConnectionStatus(false);
    } else {
      props.changeConnectionStatus(true);
    }
  
  }, [connectedDevice]); 

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

  const handleConnectToDevice = (device) => {
    openModal(device);
  };

  const handleConnect = () => {
    connectToDevice(tempDevice)
      .then((result) => {
        const [device, id] = result;
        setConnectedDevice(device);
        setDeviceId(id);
        console.log('Dev', device, 'id: ', id);
        hideModal();

        props.changeConnectionStatus(true);
        
      })
  };
  
  
  
  
  const handleDisconnect = async () => {
    disconnectFromDevice();
  
    try {
      const isConnected = await handleCheckConnection();;
      if (!isConnected) {
        props.changeConnectionStatus(false);
        console.log('Connection closed!');
      }
    } catch (error) {
      console.error('Error checking connection', error);
    }
  };
  

  
  const handleCheckConnection = async () => {
    try {
      const isConnected = await checkConnection();
      console.log('bool:', isConnected);
      return isConnected;
    } catch (error) {
      console.error('Error checking connection', error);
      return false; 
    }
  };
  
  
  

 const handelSendFile = (file) => {

  sendMessage(file);
 }

  return (
    <View style={styles.mainBox}>
      <View>
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
      </View>
      <View >
        <TouchableOpacity 
          style={[styles.utilButtons, { backgroundColor: '#018786' }]} 
          onPress={() => scanForDevices()}
        >
          <Text style={styles.deviceText}>SCAN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.utilButtons, { backgroundColor: '#CF6679' }]} 
          onPress={() => handleDisconnect()}
        >
          <Text style={styles.deviceText}>DISCONNECT</Text>
        </TouchableOpacity>

      </View>

      
      {/* <Button title='SEND' onPress={()=>handelSendFile('Ala ma kota')}/> */}
      {/* <Button title='CHECK CONNECTION' onPress={()=>handleCheckConnection()}/> */}

      {isModalVisible && (
        <Modal>
          <View style={styles.modalBox}>
            <Text>Do you want to connect to this device?{tempDevice.id}</Text> 
            <View style={styles.buttonsBox}>
              <Button style={styles.modalButton} title="YES" onPress={handleConnect} />
              <Button style={styles.modalButton} title="NO" onPress={hideModal} />
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
      backgroundColor: '#2E2E2E',
      paddingTop: 30,
      paddingHorizontal: 20,
      paddingBottom: 30,
      marginBottom:30,
      marginTop:30,
      justifyContent: 'space-between'
    },
    
    mainBoxSmallText: {
      fontFamily:'RobotoMedium',
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomColor: '#EEF5DB',
      borderBottomWidth: 1,
    },
    
    mainBoxBigText: {
      fontFamily:'RobotoMedium',
      fontSize: 24,
      marginBottom: 20,
      color:"#BB86FC"
    
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
      color: 'white',
      fontFamily:'RobotoMedium',
      fontSize: 16,
    },

    modalBox: {
      backgroundColor: '#2E2E2E',
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
      margin: 10,
      borderRadius: 10,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },

})

export default MainContent;