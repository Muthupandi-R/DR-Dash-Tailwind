import React, { useEffect, useState, useContext } from "react";
import Toast from "./Toast";
import ContextApi from "../../context/ContextApi"

const ToastManager = () => {
  const { socketData, clearSocketData } = useContext(ContextApi);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (socketData && socketData.data?.name && socketData.data?.appEventTypeDetail?.action) {
      const resourceName = socketData.data.name;
      const action = socketData?.data?.appEventTypeDetail?.action?.toLowerCase();

      const toastMsg = `${action === "started" ? "Started" : "Stopped"} ${resourceName}`;
      setMessage(toastMsg);

      // Clear socket data so we can show next unique message
      clearSocketData();
    }
  }, [socketData, clearSocketData]);

  if (!message) return null;

  return (
    <Toast
      message={message}
      onClose={() => setMessage(null)}
    />
  );
};

export default ToastManager;  
