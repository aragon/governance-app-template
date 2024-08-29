import { type RawAction } from "@/utils/types";
import { type FC, useState } from "react";
import { TextArea } from "@aragon/ods";
import { If } from "../if";
import { decodeStrJson } from "@/utils/json-actions";

interface IImportActionsFormProps {
  onChange: (actions: RawAction[]) => any;
}

export const ImportActionsForm: FC<IImportActionsFormProps> = ({ onChange }) => {
  const [actions, setActions] = useState<RawAction[]>([]);
  const [strJson, setStrJson] = useState("");

  const onJsonData = (strJson: string) => {
    try {
      setStrJson(strJson);

      const actions = decodeStrJson(strJson);
      setActions(actions);
      onChange(actions);
    } catch (_) {
      //
      setActions([]);
      onChange([]);
    }
  };

  return (
    <div className="my-6">
      <div className="pb-4">
        <TextArea
          className=""
          label="JSON actions"
          placeholder="Copy the contents of the JSON file here"
          alert={resolveCalldataAlert(strJson)}
          onChange={(e) => onJsonData(e.target.value)}
        />
      </div>

      {/* Try to decode */}
      <If lengthOf={actions} above={0}>
        <div className="flex flex-row items-center justify-between pt-4">
          <p className="text-md text-neutral-800">{actions?.length || 0} action(s) can be imported</p>
        </div>
      </If>
    </div>
  );
};

// Helpers

function resolveCalldataAlert(strJson: string): { message: string; variant: "critical" | "warning" } | undefined {
  if (!strJson) return undefined;

  try {
    decodeStrJson(strJson);
    return undefined;
  } catch (_) {
    return { message: "The given JSON data contains invalid entries", variant: "critical" };
  }
}
