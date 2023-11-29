// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FileUpload } from "@/components";
type Props = {
  setFile: (file: File) => void;
};

const ImportVcFile = ({ setFile }: Props) => {
  return (
    <>
      <div className="font-medium font-rubik text-lg text-center mb-[32px]">
        Import Credential
      </div>
      <FileUpload
        buttonProps={{
          className: "btn btn-primary",
        }}
        accept={{
          "text/json": [".json"],
        }}
        onChange={(files: File[]) => {
          if (files.length > 0) {
            setFile(files[0]);
          }
        }}
      />
    </>
  );
};

export default ImportVcFile;
