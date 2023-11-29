// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from "@zcloak/vc/types";

import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
function Selective({
  onChange,
  subject,
  value,
}: {
  subject: AnyJson;
  onChange: (value: string[] | ((value: string[]) => string[])) => void;
  value: string[];
}) {
  console.log(value);

  return (
    <div className="p-4 bg-grey rounded-lg mt-6 flex flex-col gap-2">
      {Object.entries(subject).map(([key, v]) => (
        <div className="flex justify-between items-center" key={key}>
          <label className="flex items-center gap-2 text-[#555f79] font-rubik">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={value.includes(key)}
              color="success"
              onChange={(e) => {
                if (e.target.checked) {
                  onChange((value) => [...value, key]);
                } else {
                  onChange((value) => value.filter((value) => value !== key));
                }
              }}
            />
            {key}
          </label>
          <div className="font-medium">{v?.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

const exportComponent = React.memo(Selective);

export default exportComponent;
