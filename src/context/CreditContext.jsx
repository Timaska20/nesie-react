import React, { createContext, useState } from 'react';

export const CreditContext = createContext();

export function CreditProvider({ children }) {
  const [selectedCredit, setSelectedCredit] = useState(null);

  return (
    <CreditContext.Provider value={{ selectedCredit, setSelectedCredit }}>
      {children}
    </CreditContext.Provider>
  );
}