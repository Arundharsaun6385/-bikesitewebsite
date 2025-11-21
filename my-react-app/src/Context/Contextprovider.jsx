// Contextprovider.jsx
import { createContext, useEffect, useState } from "react";

const Mycontext = createContext();

export const Contextprovider = ({ children }) => {
  


  return (
    <Mycontext.Provider value={{
    
    }}>
      {children}
    </Mycontext.Provider>
  );
};

export { Mycontext };