import React, { useEffect, useRef, useState } from 'react';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  console.log('✅ WebSocket loading...');
  const connectWebSocket = () => {
    const ws = new WebSocket('wss://1d3ede11face.ngrok-free.app/ws-resource-state');
  
    ws.onopen = () => {
      console.log('✅ WebSocket opened');
    };
  
    ws.onmessage = (event) => {
      console.log('📨 Message received:', event.data);
      // setMessages((prev) => [...prev, event.data]);
      try {
        const parsedData = JSON.parse(event.data);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log('📨 Message received: is Array');
          setMessages(parsedData[0]);
        } else {
          console.log('📨 Message received: is Object',parsedData.data);
          setMessages(prev => [...prev, parsedData.data]);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };
  
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
  
    ws.onclose = () => {
      console.log('🔌 "WebSocket closed. Reconnecting in 1 seconds...", event.reason');
      setTimeout(connectWebSocket, 1000);

    };
  
    return () => {
      ws.close();
    };
  };
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  

  return (
    <div>
      <h2>WebSocket Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {typeof msg === 'string' ? msg : JSON.stringify(msg)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
