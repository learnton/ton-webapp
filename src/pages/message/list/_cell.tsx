import type { MessageMeta } from "@/utils";
import { getTemplateById } from "@/utils";
import moment from "moment";
import { useContext } from "react";

import { AppContext } from "@/context/AppProvider";
import { AccountName, categoryMap, CTypeName, CARD_TYPE } from "@/components";
import { useLiveQuery } from "@/hooks";

function Cell({
  checked,
  message,
  setChecked,
}: {
  message: MessageMeta;
  checked: string[];
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const isChecked = checked.includes(message.id);
  const { cacheDB } = useContext(AppContext);
  const template = useLiveQuery(
    getTemplateById,
    cacheDB,
    message?.templateId ? [message?.templateId] : null
  );

  return (
    <div className="flex items-center px-2 py-4 gap-2 rounded-xl bg-white my-4">
      <input
        type="checkbox"
        className="checkbox checkbox-xs checkbox-primary"
        checked={isChecked}
        onChange={(e) => {
          if (e.target.checked) {
            setChecked((value) => [...value, message.id]);
          } else {
            setChecked((value) =>
              value.filter((value) => value !== message.id)
            );
          }
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <CTypeName cTypeHash={message.ctype} />
          <span className="text-text2 text-xs">
            {moment(message.createTime).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
        {typeof template?.category === "number" && (
          <span className="badge badge-primary mr-2">
            {categoryMap[template?.category as CARD_TYPE]}
          </span>
        )}
        <span className="mt-2 text-sm">
          Attester: <AccountName showVid value={message.sender} />
        </span>
      </div>
    </div>
  );
}

export default Cell;
