// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from "react";

export interface FileListItemProps {
  name: string;
  onDelete: () => void;
}

function FileListItem({ name, onDelete }: FileListItemProps) {
  return (
    <li className="flex items-center p-2">
      <div className="flex-1">{name}</div>
      <button className="btn btn-ghost btn-error" onClick={onDelete}>
        delete
      </button>
    </li>
  );
}

export default React.memo(FileListItem);
