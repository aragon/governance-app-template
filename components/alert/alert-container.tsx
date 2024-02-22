import { FC } from "react";
import { useAlertContext } from "@/context/AlertContext";
import { AlertCard, AlertVariant } from "@aragon/ods";
import { IAlert } from "@/utils/types";

const AlertContainer: FC = () => {
  const { alerts } = useAlertContext();

  return (
    <div className="fixed bottom-0 right-0 w-96 m-10">
      {alerts.map((alert: IAlert) => (
        <AlertCard
          className="mt-4"
          key={alert.id}
          message={alert.message}
          description={alert.description}
          variant={resolveVariant(alert.type)}
        />
      ))}
    </div>
  );
};

function resolveVariant(type: IAlert["type"]) {
  let result: AlertVariant;
  switch (type) {
    case "error":
      result = "critical";
      break;
    default:
      result = type;
  }
  return result;
}

export default AlertContainer;
