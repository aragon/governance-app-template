import React, { createContext, useState, useContext } from 'react';
import { IAlert } from '@/utils/types'

export interface AlertContextProps {
  alerts: IAlert[];
  addAlert: (message: string, txHash: string) => void;
  removeAlert: (id: number) => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  // Function to add a new alert
  const addAlert = (message: string, txHash: string) => {
    setAlerts([...alerts, { message, txHash, id: Date.now() }]);
  };

  // Function to remove an alert
  const removeAlert = (id: number) => {
    setAlerts(alerts?.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useThemeContext must be used inside the AlertProvider');
  }

  return context;
};
