import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import BleManager,{Peripheral} from 'react-native-ble-manager';
import { Buffer } from 'buffer';

function BluetoothBLETerminal() {

    const [selectedDevice, setSelectedDevice] = useState();
    const [messageToSend, setMessageToSend] = useState("");
    const [receivedMessage, setReceivedMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [intervalId, setIntervalId] = useState();
    const [isScanning, setIsScanning] = useState(false);


    const checkBluetoothEnabled = async () => {
      try {
            // turn on bluetooth if it is not on
      BleManager.enableBluetooth().then(() => {
        console.log('Bluetooth is turned on!');
      });
        
      } catch (error) {
        console.error('BLE is not available on this device.');
      }
    }
    
    const startScan = () => {
     if (!isScanning) {
       BleManager.scan([], 5, true)
         .then(() => {
           console.log('Scanning...');
           setIsScanning(true);
         })
         .catch(error => {
           console.error(error);
         });
     }
   };

    const startDeviceDiscovery = async () => {
    //  BleManager.getBondedPeripherals().then((bondedPeripheralsArray) => {
    //    // Each peripheral in returned array will have id and name properties
    //    console.log("Bonded peripherals: " + bondedPeripheralsArray.length);
    //    setPaired(bondedPeripheralsArray);
    //  });
     BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
       // Success code
       console.log("Discovered peripherals: " + peripheralsArray.length);
     });
    }

    const connectToDevice = async (device) => {
    BleManager.connect(device.id)
        .then(() => {
        // Success code
        console.log("Connected");
        setSelectedDevice(device);
        setIsConnected(true);
        BleManager.retrieveServices(device.id).then(
          (deviceInfo) => {
          // Success code
          console.log("Device info:", deviceInfo);
          }
        );
        })
        .catch((error) => {
        // Failure code
        console.log(error);
        });
    }

   const sendMessage = async () => {
    if(selectedDevice && isConnected){
      try {
       const buffer = Buffer.from(messageToSend);
       BleManager.write(
         selectedDevice.id,
         serviceid,
         caracid,
         buffer.toJSON().data
       ).then(() => {
         // Success code
         console.log("Write: " + buffer.toJSON().data);
       })
       .catch((error) => {
         // Failure code
         console.log(error);
       });
        
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
   }

   const readData = async () => {  
    if (selectedDevice && isConnected) {
       BleManager.read(
         selectedDevice.id,
         serviceid,
         caracid
       )
         .then((readData) => {
           // Success code
           console.log("Read: " + readData);
           const message = Buffer.from(readData);
           //const sensorData = buffer.readUInt8(1, true);
           if(receivedMessage.length>300){
             setReceivedMessage("");
           }
           setReceivedMessage(receivedMessage => receivedMessage + message +"\n" );
           console.log("receivedMessage length",receivedMessage.length)
         })
         .catch((error) => {
           // Failure code
           console.log("Error reading message:",error);
         });
    }
   }
   
    // disconnect from device
    const disconnectFromDevice = (device) => {
      BleManager.disconnect(device.id)
      .then(() => {
           setSelectedDevice(undefined);
           setIsConnected(false);
           setReceivedMessage("");
           clearInterval(intervalId);
           console.log("Disconnected from device");
      })
      .catch((error) => {
        // Failure code
        console.log("Error disconnecting:",error);
      });
    };
    
    
    useEffect(() => {
       checkBluetoothEnabled();
       if (Platform.OS === 'android' && Platform.Version >= 23) {
     
           PermissionsAndroid.requestMultiple([
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
           ]).then(result => {
             if (
               (result['android.permission.BLUETOOTH_SCAN'] &&
               result['android.permission.BLUETOOTH_CONNECT'] &&
               result['android.permission.ACCESS_FINE_LOCATION'] === 'granted')
               ||
               (result['android.permission.BLUETOOTH_SCAN'] &&
               result['android.permission.BLUETOOTH_CONNECT'] &&
               result['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again')
             ) {
               console.log('User accepted');
             } else {
               console.log('User refused');        }
           });
       }
       BleManager.start({showAlert: false}).then(() => {
         console.log('BleManager initialized');
         startDeviceDiscovery();
       }).catch((error) => {
         // Failure code
         console.log("Error requesting permission:",error);
       });
    });
      
   BleManager.checkState().then((state) =>
      console.log(`current BLE state = '${state}'.`)
    );

    BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
      // Success code
      console.log("Connected peripherals: " + peripheralsArray.length);
    });
    
    BleManager.getBondedPeripherals().then((bondedPeripheralsArray) => {
      // Each peripheral in returned array will have id and name properties
      console.log("Bonded peripherals: " + bondedPeripheralsArray.length);
      //setBoundedDevices(bondedPeripheralsArray);
    });
    
    BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
      // Success code
      console.log("Discovered peripherals: " + peripheralsArray.length);
    });

    return(
        checkBluetoothEnabled,
        startScan,
        startDeviceDiscovery,
        connectToDevice,
        sendMessage,
        disconnectFromDevice,
        selectedDevice,
        

    );

}

export default BluetoothBLETerminal;