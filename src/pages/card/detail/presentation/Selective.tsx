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
  return (
    <div className="p-2 bg-body rounded">
      {Object.entries(subject).map(([key, v]) => (
        <div className="flex justify-between items-center" key={key}>
          <div className="flex items-center gap-2">
            {key}
            <input
              type="checkbox"
              className="checkbox"
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
          </div>
          <div className="font-medium">{v?.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

const exportComponent = React.memo(Selective);

export default exportComponent;
