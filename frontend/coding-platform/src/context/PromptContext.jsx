import React, { createContext, useContext, useState } from 'react';

const PromptContext = createContext();

export const usePrompt = () => useContext(PromptContext);

export const PromptProvider = ({ children }) => {
  const [promptState, setPromptState] = useState({
    isOpen: false,
    title: '',
    label: '',
    onSubmit: () => {},
  });

  const showPrompt = ({ title, label, onSubmit }) => {
    setPromptState({
      isOpen: true,
      title,
      label,
      onSubmit: (inputValue) => {
        // When the modal's form is submitted, it calls this function
        onSubmit(inputValue);
        // We can hide the modal after submission
        hidePrompt(); 
      },
    });
  };

  const hidePrompt = () => {
    setPromptState({ isOpen: false, title: '', label: '', onSubmit: () => {} });
  };

  const value = {
    ...promptState,
    showPrompt,
    hidePrompt,
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
};
