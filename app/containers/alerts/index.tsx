import Alert from '@/app/components/alert'
import { useAlertContext } from '@/app/context/AlertContext'
import { IAlert } from '@/utils/types'
import { FC, useEffect } from 'react'

const Alerts: FC = () => {
  const { alerts, addAlert } = useAlertContext()

  return (
    <>
      {alerts.map((alert: IAlert) => (
        <Alert key={alert.id} {...alert} />
      ))}
    </>
  )
}

export default Alerts
