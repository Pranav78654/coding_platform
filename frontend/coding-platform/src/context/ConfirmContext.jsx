import React, { createContext, useContext, useState } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    title: '',
    onConfirm: () => {},
  });

  const showConfirm = ({ title, message, onConfirm }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        // When the user clicks "Confirm", we run their function and close the modal.
        onConfirm();
        hideConfirm();
      },
    });
  };

  const hideConfirm = () => {
    setConfirmState({ isOpen: false, message: '', title: '', onConfirm: () => {} });
  };

  const value = {
    ...confirmState,
    showConfirm,
    hideConfirm,
  };

  return <ConfirmContext.Provider value={value}>{children}</ConfirmContext.Provider>;
};
