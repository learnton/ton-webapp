// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

import FileListItem from "./FileListItem";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface FileUploadProps
  extends Omit<DropzoneOptions, "onDrop" | "onDropAccepted"> {
  label?: React.ReactNode;
  buttonProps?: Omit<ButtonProps, "onClick">;
  buttonText?: string;
  onChange: (files: File[]) => void;
}

function FileUpload({
  buttonProps,
  buttonText = "Click or drop files",
  disabled,
  label,
  maxSize,
  onChange,
  ...options
}: FileUploadProps) {
  const [value, setValue] = useState<File[]>([]);
  const { fileRejections, getInputProps, getRootProps, open } = useDropzone({
    ...options,
    disabled,
    maxSize,
    onDropAccepted: setValue,
    noClick: true,
    noKeyboard: true,
  });

  const remove = (index: number) => {
    const files = [...value];

    files.splice(index, 1);
    setValue(files);
  };

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const files = value.map((file, i) => (
    <FileListItem key={file.name} name={file.name} onDelete={() => remove(i)} />
  ));

  return (
    <div>
      {label && <div className="text-sm font-medium">{label}</div>}
      <div
        className="rounded py-4 px-1 min-h-[160px] bg-[#F5F6FA] flex flex-col justify-center items-center"
        {...getRootProps()}
      >
        <div className="flex flex-col justify-center items-center">
          <input {...getInputProps()} />
          <button
            className="btn"
            disabled={disabled}
            onClick={open}
            {...buttonProps}
          >
            {buttonText}
          </button>
          <div className="text-sm text-text2">
            {fileRejections[0]?.errors[0]?.message}{" "}
          </div>
        </div>
        {files.length > 0 && (
          <ul className="flex justify-center flex-wrap p-1">{files}</ul>
        )}
      </div>
    </div>
  );
}

export default React.memo(FileUpload);
