'use client'

import { AlertContext } from '@/app/context/AlertContext';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { IAlert } from '@/utils/types'
import { formatAddress } from '@/utils/addressHelper';
import { Address } from 'viem';
import { useWaitForTransaction } from 'wagmi'
import { Icon, IconType } from '@aragon/ods';


const Alert: React.FC<IAlert> = ({ message, txHash, id }) => {
  const alertContext = useContext(AlertContext);
  const removeAlert = alertContext ? alertContext.removeAlert : () => { };
  const [hide, setHide] = useState<boolean>(false)
  const { isSuccess } = useWaitForTransaction({
    hash: txHash as `0x${string}`,
  })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setHide(true);
    }, 4000);

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
        }, 4000);
    }
  }, [isSuccess, removeAlert]);

  if (!hide) return (
    <>
      {/** bg-success-50 bg-primary-50 text-success-900 text-primary-900 */}
      <div className={`fixed bottom-0 right-0 ${isSuccess ? 'bg-success-100 border-success-500' : 'bg-primary-100 border-primary-500'} text-neutral-900 shadow-xl py-6 px-5 m-10 rounded-xl border w-96`}>
        <div className="flex flex-row gap-2">
          <Icon
            className={`rounded-full ${isSuccess ? 'bg-success-300 text-success-900' : 'bg-primary-300 text-primary-900'} p-2 w-14 h-14 self-center`}
            size="lg"
            icon={IconType.APP_GOVERNANCE}
          />
          <div className="flex flex-col pl-1">
            <p className={`text-xl font-semibold ${isSuccess ? 'text-success-900' : 'text-primary-900'} pb-2`}>{message}</p>
            {isSuccess
              ? (<p className={'text-success-900'}>Your tx <span className="underline font-semibold">{formatAddress(txHash as Address)} </span>is confirmed</p>)
              : (<p className={'text-primary-900'}>Check your tx: <span className="underline font-semibold">{formatAddress(txHash as Address)}</span></p>)
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
