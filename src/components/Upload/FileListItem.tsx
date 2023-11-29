// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import IconDelete from "@/assets/img/btn_delete.svg?react";

export interface FileListItemProps {
  name: string;
  onDelete: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
function FileListItem({ name, onDelete }: FileListItemProps) {
  return (
    <li className="flex p-2 items-center">
      <div className="flex-1">{name}</div>
      <button className="text-error btn btn-ghost" onClick={onDelete}>
        <IconDelete />
      </button>
    </li>
  );
}

const exportComponent = React.memo(FileListItem);

export default exportComponent;
