// src/hooks/useNotification.js
import { useState } from "react";

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return { notification, showNotification, closeNotification };
};

export default useNotification;
