/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { QrHandleResult, QrResult, QrResultTypes } from "./_utils/types";
import { ScanContext } from "@/context/ScanProvider";
import { isJsonObject } from "@polkadot/util";
import Scanner from "qr-scanner";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { isVP } from "@zcloak/vc/is";

import { useToggle } from "@/hooks";
import { isDomain, isUrl } from "@/utils";
import { isVpWithTemplate } from "../_components/QrcodePresentation";
import { UploadPicture } from "@/components";

function makeParts(): (part: {
  index: number;
  length: number;
  value: string;
}) => string[] {
  const parts: { index: number; length: number; value: string }[] = [];

  return (part) => {
    if (!parts.find(({ index }) => part.index === index)) {
      parts.push(part);
    }

    return parts.sort((l, r) => l.index - r.index).map(({ value }) => value);
  };
}

function extraResult(
  data: string,
  onDone: (result: [QrResultTypes, QrResult[QrResultTypes]]) => void,
  onProgress: (progress: number) => void,
  addParts?: (part: {
    index: number;
    length: number;
    value: string;
  }) => string[]
): void {
  try {
    const json = JSON.parse(data);

    if (
      isJsonObject(json) &&
      Object.prototype.hasOwnProperty.call(json, "didUrl") &&
      Object.prototype.hasOwnProperty.call(json, "version") &&
      Object.prototype.hasOwnProperty.call(json, "identifierKey") &&
      Object.prototype.hasOwnProperty.call(json, "keys") &&
      Object.prototype.hasOwnProperty.call(json, "authentication") &&
      Object.prototype.hasOwnProperty.call(json, "assertionMethod") &&
      Object.prototype.hasOwnProperty.call(json, "keyAgreement") &&
      Object.prototype.hasOwnProperty.call(json, "capabilityInvocation") &&
      Object.prototype.hasOwnProperty.call(json, "capabilityDelegation")
    ) {
      onProgress(1);
      onDone(["keys", json as DidKeys$Json]);
    } else if (isVP(json) || isVpWithTemplate(json)) {
      onProgress(1);
      onDone(["vp", json]);
    } else if (
      Object.prototype.hasOwnProperty.call(json, "length") &&
      Object.prototype.hasOwnProperty.call(json, "index") &&
      Object.prototype.hasOwnProperty.call(json, "value")
    ) {
      if (addParts) {
        const parts = addParts(json);

        onProgress(parts.join("").length / json.length);

        if (parts.join("").length === json.length) {
          extraResult(parts.join(""), onDone, onProgress);
        }
      }
    }
  } catch {
    if (isDomain(data) || isUrl(data)) {
      onProgress(1);
      onDone(["url", data]);
    } else {
      onDone(["raw", data]);
    }
  }
}

async function startScan(
  scanner: React.MutableRefObject<Scanner | null>,
  ele: HTMLVideoElement,
  onResult: QrHandleResult,
  onProgress: (progress: number) => void
) {
  if (!(await Scanner.hasCamera())) return;

  const addParts = makeParts();

  scanner.current = new Scanner(
    ele,
    (result: { data: string }) => {
      const data: string = result.data;

      extraResult(
        data,
        (result) => {
          onResult(...result);
        },
        onProgress,
        addParts
      );
    },
    {
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
    }
  );
  void scanner.current.start();
}

function destroy(scanner: React.MutableRefObject<Scanner | null>) {
  scanner.current?.destroy();
}

// eslint-disable-next-line react-refresh/only-export-components
function LinearProgressWithLabel(props: { value: number }) {
  return (
    <progress
      className="w-full progress progress-success"
      value={props.value}
      max="100"
    ></progress>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function Scan() {
  const ScanState = useContext(ScanContext);
  const onResultRef: QrHandleResult = useCallback(
    (type, result) => {
      console.log("onResultRef", type, result);
      ScanState.set([type, result]);
    },
    [ScanState]
  );
  const navigate = useNavigate();
  const container = useRef<HTMLVideoElement | null>(null);
  const scanner = useRef<Scanner | null>(null);
  const [mode, setMode] = useState<Scanner.FacingMode>("environment");
  const [isScan, toggleScan] = useToggle(true);
  const [imgData, setImgData] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isScan) {
      void startScan(
        scanner,
        container.current as HTMLVideoElement,
        onResultRef,
        setProgress
      );
    }

    return () => {
      destroy(scanner);
    };
  }, [isScan, onResultRef]);

  const onSelect = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        toggleScan();
        const file = files[0];

        const reader = new FileReader();

        reader.onload = function (event) {
          const imgData = event.target?.result?.toString();

          setImgData(imgData);

          if (imgData) {
            void Scanner.scanImage(imgData, {
              alsoTryWithoutScanRegion: true,
              returnDetailedScanResult: true,
            }).then((result: { data: string }) => {
              extraResult(
                result.data,
                (result) => {
                  onResultRef(...result);
                },
                setProgress
              );
            });
          }
        };

        reader.readAsDataURL(file);
      }
    },
    [onResultRef, toggleScan]
  );

  return (
    <div className="flex flex-col h-[100vh] py-4">
      <div className="flex flex-col flex-1 mb-4 relative overflow-hidden">
        {isScan ? (
          <>
            <video
              autoPlay
              ref={container}
              className="object-cover flex-1 mb-4 w-full"
            />
            <LinearProgressWithLabel value={progress * 100} />
          </>
        ) : (
          <img src={imgData} style={{ width: "100%" }} />
        )}
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <button
            className="btn"
            onClick={() => {
              const value = mode === "environment" ? "user" : "environment";

              setMode(value);
              void scanner.current?.setCamera(value);
            }}
          >
            toggle
          </button>
          <button
            className="flex-1 btn btn-primary"
            onClick={() => navigate("/")}
          >
            Close
          </button>
          <UploadPicture
            accept={{
              "image/*": [".png", ".jpeg", ".jpg", ".webp"],
            }}
            multiple={false}
            onChange={onSelect}
            onClick={toggleScan}
          />
        </div>
      </div>
    </div>
  );
}

const exportComponent = React.memo(Scan);
export default exportComponent;
