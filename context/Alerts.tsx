import React, { createContext, useState, useContext } from "react";
import { IAlert } from "@/utils/types";
import { usePublicClient } from "wagmi";

const DEFAULT_ALERT_TIMEOUT = 7 * 1000;

export type AlertOptions = {
  type?: "success" | "info" | "error";
  description?: string;
  txHash?: string;
  timeout?: number;
};

export interface AlertContextProps {
  alerts: IAlert[];
  addAlert: (message: string, alertOptions?: AlertOptions) => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const client = usePublicClient();

  // Add a new alert to the list
  const addAlert = (message: string, alertOptions?: AlertOptions) => {
    // Clean duplicates
    const idx = alerts.findIndex((a) => {
      if (a.message !== message) return false;
      else if (a.description !== alertOptions?.description) return false;
      else if (a.type !== alertOptions?.type) return false;
      return true;
    });
    if (idx >= 0) {
      // Update the existing one
      setAlerts((curAlerts) => {
        const [prevAlert] = curAlerts.splice(idx, 1);
        clearTimeout(prevAlert?.dismissTimeout);
        const timeout = alertOptions?.timeout ?? DEFAULT_ALERT_TIMEOUT;
        prevAlert.dismissTimeout = setTimeout(() => removeAlert(prevAlert.id), timeout);
        return curAlerts.concat(prevAlert);
      });
      return;
    }

    const newAlert: IAlert = {
      id: Date.now(),
      message,
      description: alertOptions?.description,
      type: alertOptions?.type ?? "info",
    };
    if (alertOptions?.txHash && client) {
      newAlert.explorerLink = client.chain.blockExplorers?.default.url + "/tx/" + alertOptions.txHash;
    }
    const timeout = alertOptions?.timeout ?? DEFAULT_ALERT_TIMEOUT;
    newAlert.dismissTimeout = setTimeout(() => removeAlert(newAlert.id), timeout);
    setAlerts((curAlerts) => curAlerts.concat(newAlert));
  };

  // Function to remove an alert
  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return <AlertContext.Provider value={{ alerts, addAlert }}>{children}</AlertContext.Provider>;
};

export const useAlerts = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useContext must be used inside the AlertProvider");
  }

  return context;
};
