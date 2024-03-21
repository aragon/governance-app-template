import { FC } from "react";
import { useAlerts } from "@/context/Alerts";
import { AlertCard, AlertVariant, Icon, IconType } from "@aragon/ods";
import { IAlert } from "@/utils/types";

const AlertContainer: FC = () => {
  const { alerts } = useAlerts();

  return (
    <div className="fixed top-0 right-0 w-72 md:w-96 m-4 z-50">
      {alerts.map((alert: IAlert) => (
        <AlertCard
          className="drop-shadow-lg mb-4"
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
    return <span className="block text-sm mt-1">{alert.description}</span>;
  }

  return (
    <>
      <span className="block text-sm mt-1">{alert.description}</span>
      <a href={alert.explorerLink} target="_blank">
        <div className="flex flex-row text-xs underline text-primary-200">
          <div className="">Show transaction</div>
          <div>
            <Icon
              className="ml-2 mt-1"
              size="sm"
              icon={IconType.LINK_EXTERNAL}
            />
          </div>
        </div>
      </a>
    </>
  );
}

export default AlertContainer;
