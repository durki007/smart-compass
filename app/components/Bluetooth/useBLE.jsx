
import { useEffect, useContext } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { BLEContext } from '../BLEProvider';

const bleManager = new BleManager();



function useBLE() {
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
      let foundCharacteristic = null;

      await bleManager.connectToDevice(device.id);

      // setDeviceId(device.id);
      // setConnectedDevice(device);


      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();


      for (const service of services) {
        const characteristics = await service.characteristics();

        // Find the first writable characteristic
        const pathCharacteristic = characteristics.find(characteristic => {
          return characteristic.uuid == "33333333-2222-2222-1111-111100000000";
        });

        if (pathCharacteristic) {
          foundCharacteristic = pathCharacteristic;
          break; // Exit the loop if a writable characteristic is found
        }
      }



      if (foundCharacteristic) {
        setServiceId(foundCharacteristic.serviceUUID);
        setCaradId(foundCharacteristic.uuid);

        console.log('Writable characteristic found:', foundCharacteristic);
      } else {
        console.log('No writable characteristic found');
      }


      bleManager.stopDeviceScan();

      bleManager.onDeviceDisconnected(device.id, (error, device) => {
        if (error) {
          console.log(error);
        }
        console.log('Device is disconnected');
        setConnectedDevice(null);
        console.log('connectedDev after disconnetion:', connectedDevice);
      });

      console.log('Dev', device, 'id: ', device.id);

      return [device, device.id];
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  useEffect(() => {
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
          // console.log('User accepted');
        } else {
          // console.log('User refused');        
        }
      });
    }
  })

  const sendMessage = (message) => {
    console.log("Sending message: ", message, " to characteristic: ", caracId);
    const base64Value = Buffer.from(message).toString('base64');
    return connectedDevice.writeCharacteristicWithResponseForService(serviceId, caracId, base64Value)
  }

  const checkConnection = async () => {
    console.log('device:', connectedDevice);
    console.log('deviceID:', deviceId);
    if (deviceId === null || connectedDevice === null) {
      return false;
    }

    return await bleManager.isDeviceConnected(deviceId);
  }



  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    disconnectFromDevice,
    sendMessage,
    checkConnection,
    serviceId,
    deviceId,
    connectedDevice
  };
}

export default useBLE;
