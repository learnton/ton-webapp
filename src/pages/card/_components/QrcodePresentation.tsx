/* eslint-disable react-refresh/only-export-components */
import { isJsonObject, isNumber } from "@polkadot/util";
import qrcode from "qrcode-generator";
import React, { useEffect, useRef, useState } from "react";

import { isVP } from "@zcloak/vc/is";
import { VerifiablePresentation, VerifiableCredential } from "@zcloak/vc/types";

import { TimeNow, ActionModal, BaseTempProps } from "@/components";
import SendProof from "../_components/SendProof";

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
      className="bg-body rounded-lg shadow-lg aspect-square overflow-hidden"
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
  vc,
  template,
}: {
  cellSize?: number;
  open: boolean;
  isParts?: boolean;
  presentation?: VerifiablePresentation;
  templateId?: number;
  onClose: () => void;
  vc?: VerifiableCredential<boolean>;
  template?: BaseTempProps;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <ActionModal onClose={onClose} open={open}>
        <div className="p-4">
          {open && presentation && (
            <Code
              cellSize={cellSize}
              isParts={isParts}
              presentation={presentation}
              templateId={templateId}
            />
          )}

          <div className="font-medium text-center mt-4 text-text2">
            <TimeNow />
          </div>
          <button
            className="btn btn-block btn-outline btn-primary mt-4"
            disabled={!(vc && template)}
            onClick={() => {
              setOpenModal(true);
              onClose();
            }}
          >
            Send Proof
          </button>
        </div>
      </ActionModal>

      {openModal && vc && template && (
        <SendProof
          template={template}
          vc={vc}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

const exportComponent = React.memo(QrcodePresentation);

export default exportComponent;
