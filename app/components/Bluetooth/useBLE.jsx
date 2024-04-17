
import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import {atob} from 'react-native-quick-base64';

// const HEART_RATE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
// const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

const bleManager = new BleManager();

let serviceid="d0611e78-bbb4-4591-a5f8-487910ae4366";
let caracid="8667556c-9a37-4c91-84ed-54ee27d90049";
const dataToSend = 'Hello, BLE!';

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);

  const requestPermissions = async (cb) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        cb(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const isGranted =
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        cb(isGranted);
      }
    } else {
      cb(true);
    }
  };

  const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name) {    
        console.log('Detected new device:', device.name);

        setAllDevices((prevState) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device) => {

    try {
      console.log('Trying to connect to dev: ', device.name);

      await bleManager.connectToDevice(device.id);
      
      await device.discoverAllServicesAndCharacteristics();

      // RETRIEVE SERVICES
      const services = await device.services();
      console.log('services: ', services);
      
      services.forEach(async (service) => {
        const characteristics = await service.characteristics();
        console.log('Characteristics for service', service.uuid, ':', characteristics);
      });
      
      bleManager.stopDeviceScan();
      console.log('connected to device!: ', device.name)

      setConnectedDevice(device);
      
      // console.log('Currently connected to:' ,device.serviceData);
    //   startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    console.log(connectedDevice);
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

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

  useEffect(() => {
    // checkBluetoothEnabled();
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
            console.log('User refused');        
            }
        });
    }

  })

  const sendMessage = () => {
        try {
            const base64Value = Buffer.from("Ala ma kota").toString('base64');
            connectedDevice.writeCharacteristicWithResponseForService(serviceid, caracid, base64Value);
            console.log('Success sending!');
        } catch (error){
            console.error('Error sending message:', error);
        }

      
  }


  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    sendMessage,
  };
}

export default useBLE;
