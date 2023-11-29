// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FileUpload } from "@/components";

const ImportVcFile: React.FC<{
  setFile: (file: File) => void;
}> = ({ setFile }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-medium font-rubik mb-[32px] text-center">
        Import Credential
      </div>
      <FileUpload
        accept={{
          "text/json": [".json"],
        }}
        label="Import"
        onChange={(files: File[]) => {
          if (files.length > 0) {
            setFile(files[0]);
          }
        }}
      />
    </div>
  );
};

export default ImportVcFile;
