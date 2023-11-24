'use client'

import { AlertContext } from '@/app/context/AlertContext';
import React, { useEffect, useContext, useState } from 'react';
import { IAlert } from '@/utils/types'
import { formatAddress } from '@/utils/addressHelper';
import { Address } from 'viem';
import { useWaitForTransaction } from 'wagmi'


const Alert: React.FC<IAlert> = ({ message, txHash, id }) => {
  const alertContext = useContext(AlertContext);
  const removeAlert = alertContext ? alertContext.removeAlert : () => { };
  const [hide, setHide] = useState<boolean>(false)
  const { isSuccess } = useWaitForTransaction({
    hash: txHash as `0x${string}`,
  })

  // Listen for transaction status here
  // Update the alert based on the transaction status


  useEffect(() => {
    // Remove the alert after 5 seconds
    const timer = setTimeout(() => {
      setHide(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, setHide]);

  useEffect(() => {
    if (isSuccess) {
      removeAlert(id)
    }
  }, [isSuccess, removeAlert])

  if (!hide) return (
    <div className={`fixed bottom-0 right-0 bg-${isSuccess ? 'success' : 'primary'}-100 text-neutral-900 p-4 m-4 rounded`}>
      <p className="text-xl font-semibold">{message}</p>
      {isSuccess
        ? (<p className="">Check your tx: <span className="underline font-semibold font-primary-500">{formatAddress(txHash as Address)}</span></p>)
        : (<p className="">Your tx <span className="underline font-semibold font-primary-500">{formatAddress(txHash as Address)} </span>is confirmed</p>)
      }
    </div>
  );
};

export default Alert;
