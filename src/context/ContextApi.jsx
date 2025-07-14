import React, { createContext, useState, useEffect, useRef } from 'react';

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  const [socketData, setSocketData] = useState(null);
  const socketRef = useRef(null);
  const [selectedCloud, setSelectedCloud] = useState(localStorage.getItem('selectedCloud') || 'azure');

  const connectWebSocket = () => {
    const wsUrl = "wss://drdashboard.4blabs.com/azure"


    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected:", wsUrl);
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setSocketData(parsedData[0]);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket closed. Reconnecting in 3 seconds...", event.reason);
      setTimeout(connectWebSocket, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearSocketData = () => {
    setSocketData(null);
  };

  const handleCloudChange = (provider) => {
      localStorage.setItem('selectedCloud', provider);
      setSelectedCloud(provider);
  };
  
  return (
    <ContextApi.Provider value={{ socketData, clearSocketData , selectedCloud, handleCloudChange }}>
      {children}
    </ContextApi.Provider>
  );
};

export default ContextApi;
