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
      // .then((isConnected) => {
      //   props.changeConnectionStatus(isConnected);
      //   // console.log('Połączono z urządzeniem: ', connectedDevice.name);
      // })
      // .catch((error) => {
      //   console.error('Error checking connection', error);
      //   console.log(error.reason);
      // })
      // .finally(() => {
      //   console.log('Why', connectedDevice, deviceId);
      // });
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
      // console.log("Reason:", error.reason); // Accessing the reason property
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
      <Button title='SEND' onPress={()=>handelSendFile('Ala ma kota')}/>
      <Button title='CHECK CONNECTION' onPress={()=>handleCheckConnection()}/>
      <Button title='DISCONNECT' onPress={()=>handleDisconnect()}/>


      {isModalVisible && (
        <Modal>
          <View style={styles.modalBox}>
            <Text>Czy na pewno chcesz połączyć się z urzadzeniem? {tempDevice.id}</Text> 
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