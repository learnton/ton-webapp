import React, { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import InsertPhotoIcon from "@/assets/img/icon_pic.svg?react";

export interface FileUploadProps
  extends Omit<DropzoneOptions, "onDrop" | "onDropAccepted"> {
  label?: React.ReactNode;
  onChange: (files: File[]) => void;
  onClick: () => void;
}

function FileUpload({
  disabled,
  maxSize,
  onChange,
  ...options
}: FileUploadProps) {
  const [value, setValue] = useState<File[]>([]);
  const { getInputProps, open } = useDropzone({
    ...options,
    disabled,
    maxSize,
    onDropAccepted: setValue,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const onClick = useCallback(() => {
    open();
    onClick();
  }, [open]);

  return (
    <div>
      <input {...getInputProps()} />
      <button className="btn" disabled={disabled} onClick={open}>
        <InsertPhotoIcon />
      </button>
    </div>
  );
}

export default React.memo(FileUpload);
