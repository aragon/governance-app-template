import { AlertContext } from "@/context/AlertContext";
import React, { useEffect, useContext, useState, useRef } from "react";
import { IAlert } from "@/utils/types";
import { useWaitForTransaction } from "wagmi";
import { AlertCard } from "@aragon/ods";
import { Else, If, IfCase, Then } from "../if";
import { TransactionText } from "../text/transaction";

const ALERT_TIMEOUT = 9 * 1000;

const Alert: React.FC<IAlert> = ({ message, txHash, id }) => {
  const alertContext = useContext(AlertContext);
  const removeAlert = alertContext ? alertContext.removeAlert : () => { };
  const [hide, setHide] = useState<boolean>(false);
  const { isSuccess } = useWaitForTransaction({
    hash: txHash as `0x${string}`,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setHide(true);
    }, ALERT_TIMEOUT);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, setHide]);

  useEffect(() => {
    if (isSuccess) {
      removeAlert(id);
      setHide(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setHide(true);
      }, ALERT_TIMEOUT);
    }
  }, [isSuccess, removeAlert]);

  if (hide) return <div suppressHydrationWarning />;

  /** bg-success-50 bg-primary-50 text-success-900 text-primary-900 */
  return (
    <div className="fixed bottom-0 right-0 w-96 m-10">
      <AlertCard
        message={message}
        variant={isSuccess ? "success" : "info"}
        description={isSuccess ? `Your transaction ${txHash} is confirmed` : `Your transaction ${txHash} was submitted`}
      />

    </div>
  );
};

export default Alert;
