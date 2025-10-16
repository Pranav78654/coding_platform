// src/context/AlertContext.jsx

import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    title: '',
  });

  const showAlert = (message, title = 'An Error Occurred') => {
    setAlertState({ isOpen: true, message, title });
  };

  const hideAlert = () => {
    setAlertState({ isOpen: false, message: '', title: '' });
  };

  const value = {
    ...alertState,
    showAlert,
    hideAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};