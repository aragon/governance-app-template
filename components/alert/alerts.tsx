import Alert from '@/components/alert'
import { useAlertContext } from '@/context/AlertContext'
import { IAlert } from '@/utils/types'
import { FC } from 'react'

const Alerts: FC = () => {
  const { alerts } = useAlertContext()

  return (
    <>
      {alerts.map((alert: IAlert) => (
        <Alert key={alert.id} {...alert} />
      ))}
    </>
  )
}

export default Alerts
