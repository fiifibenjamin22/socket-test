import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketListener = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [builderData, setBuilderData] = useState({
    company_id: '',
    builder_id: '',
    builder_lat: '',
    builder_long: '',
  });

  useEffect(() => {
    const socket = io('http://localhost:4242', {
      withCredentials: true
    });

    socket.on('connect', () => {
      setIsConnected(true);

      // Join the 'joinLocationRoom' room
      socket.emit('joinRoom', '64c5ac830b6c14454e5cd748', '64c5ac830b6c14454e5cd748').listeners(eventNames => {
        console.log('eventNames', eventNames);
      });

      // Listen for the 'updateAddress' event inside the 'joinLocationRoom' room
      socket.on('updateAddress', (company_id, builder_id, builder_lat, builder_long) => {
        console.log('Received updateAddress event in joinLocationRoom:', company_id, builder_id, builder_lat, builder_long);
        // Update builderData state or perform other actions
        setBuilderData({
          company_id,
          builder_id,
          builder_lat,
          builder_long
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>Socket Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <p>Company ID: {builderData.company_id}</p>
      <p>Builder ID: {builderData.builder_id}</p>
      <p>Latitude: {builderData.builder_lat}</p>
      <p>Longitude: {builderData.builder_long}</p>
    </div>
  );
};

export default SocketListener;
