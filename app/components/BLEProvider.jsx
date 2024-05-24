import React, { createContext, useState, useEffect } from 'react';

export const BLEContext = createContext();

export const BLEProvider = ({ children }) => {
  const [serviceId, setServiceId] = useState("d0611e78-bbb4-4591-a5f8-487910ae4366");
  const [caracId, setCaradId] = useState("8667556c-9a37-4c91-84ed-54ee27d90049");
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // useEffect(() => {
  //   console.log('Connected device:', connectedDevice);
  // }, [connectedDevice]); // Log connectedDevice whenever it changes


  return (
    <BLEContext.Provider
      value={{
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
      }}
    >
      {children}
    </BLEContext.Provider>
  );
};