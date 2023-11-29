/* eslint-disable react-refresh/only-export-components */
import { isJsonObject, isNumber } from "@polkadot/util";
import qrcode from "qrcode-generator";
import React, { useEffect, useRef } from "react";

import { isVP } from "@zcloak/vc/is";
import { VerifiablePresentation } from "@zcloak/vc/types";

import { TimeNow, ActionModal } from "@/components";

export interface VpWithTemplate {
  vp: VerifiablePresentation;
  templateId: number;
}

export function isVpWithTemplate(input: unknown): input is VpWithTemplate {
  return isJsonObject(input)
    ? isVP(input?.vp) && isNumber(input?.templateId)
    : false;
}

function stringToParts(value: string, size: number): string[] {
  const results: string[] = [];

  const length = value.length;

  for (let i = 0, index = 0; i < value.length; i += size, index++) {
    results.push(
      JSON.stringify({
        index,
        length,
        value: value.substring(i, i + size),
      })
    );
  }

  return results;
}

// TODO refactor by QRCodeGenerator

const Code = ({
  cellSize,
  isParts,
  presentation,
  templateId,
}: {
  isParts?: boolean;
  cellSize?: number;
  presentation: VerifiablePresentation;
  templateId?: number;
}) => {
  const qr = useRef(qrcode(0, "L"));
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isParts) {
      const vpWithTemplate: VpWithTemplate | VerifiablePresentation = templateId
        ? { vp: presentation, templateId }
        : presentation;

      const parts = stringToParts(JSON.stringify(vpWithTemplate), 300);
      let index = 0;

      setInterval(() => {
        if (index === parts.length) index = 0;

        qr.current = qrcode(0, "L");
        qr.current.addData(parts[index]);
        qr.current.make();

        if (container.current)
          container.current.innerHTML = qr.current.createImgTag(cellSize);

        index++;
      }, 800);
    } else {
      setTimeout(() => {
        qr.current = qrcode(0, "L");

        qr.current.addData(JSON.stringify(presentation));
        qr.current.make();

        if (container.current)
          container.current.innerHTML = qr.current.createImgTag(cellSize);
      }, 100);
    }
  }, [cellSize, isParts, presentation, templateId]);

  return (
    <div
      className="bg-body rounded-lg mx-auto h-[330px] shadow w-[330px] CredentialQrcode overflow-hidden"
      ref={container}
    />
  );
};

const QrcodePresentation = function ({
  cellSize = 5,
  isParts,
  onClose,
  open,
  presentation,
  templateId,
}: {
  cellSize?: number;
  open: boolean;
  isParts?: boolean;
  presentation?: VerifiablePresentation;
  templateId?: number;
  onClose: () => void;
}) {
  console.log("open=", open);
  return (
    <ActionModal onClose={onClose} open={open}>
      <div className="p-4">
        <div>
          {open && presentation && (
            <Code
              cellSize={cellSize}
              isParts={isParts}
              presentation={presentation}
              templateId={templateId}
            />
          )}
        </div>

        <div className="font-medium text-center">
          <TimeNow />
        </div>
      </div>
    </ActionModal>
  );
};

const exportComponent = React.memo(QrcodePresentation);

export default exportComponent;
