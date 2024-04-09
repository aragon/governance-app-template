import { type FC } from "react";
import { useAlerts } from "@/context/Alerts";
import { AlertCard, type AlertVariant, Icon, IconType } from "@aragon/ods";
import { type IAlert } from "@/utils/types";

const AlertContainer: FC = () => {
  const { alerts } = useAlerts();

  return (
    <div className="fixed right-0 top-0 z-50 m-4 w-72 md:w-96">
      {alerts.map((alert: IAlert) => (
        <AlertCard
          className="mb-4 drop-shadow-lg"
          key={alert.id}
          message={alert.message}
          description={resolveDescription(alert)}
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

function resolveDescription(alert: IAlert) {
  if (!alert.explorerLink) {
    return <span className="mt-1 block text-sm">{alert.description}</span>;
  }

  return (
    <>
      <span className="mt-1 block text-sm">{alert.description}</span>
      <a href={alert.explorerLink} target="_blank">
        <div className="flex flex-row text-xs text-primary-200 underline">
          <div className="">Show transaction</div>
          <div>
            <Icon className="ml-2 mt-1" size="sm" icon={IconType.LINK_EXTERNAL} />
          </div>
        </div>
      </a>
    </>
  );
}

export default AlertContainer;
