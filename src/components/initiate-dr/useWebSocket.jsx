// useWebSocket.js
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useWebSocket = (topicId, onMessage) => {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!topicId) return;

    // Create SockJS + STOMP client
    const socket = new SockJS("https://devapi.drtestdash.com/disaster-recovery/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("✅ WebSocket connected for topic:", topicId);

      // subscribe to topic using topicId
      clientRef.current = stompClient.subscribe(
        `${topicId}`,
        (message) => {
          const payload = JSON.parse(message.body);
          console.log("📩 WS Update:", payload);

          // Pass data to callback
          if (onMessage) onMessage(payload);
        }
      );
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame);
    };

    stompClient.activate();

    return () => {
      console.log("🔌 Disconnect WebSocket:", topicId);
      clientRef.current?.unsubscribe();
      stompClient.deactivate();
    };
  }, [topicId, onMessage]);
};

export default useWebSocket;
