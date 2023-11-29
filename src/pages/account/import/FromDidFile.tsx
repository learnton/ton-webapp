/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { DidKeys$Json } from "@zcloak/did/keys/types";

import React, { useCallback, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppProvider";

import {
  useToast,
  AccountIcon,
  AccountName,
  FileUpload,
  Password,
} from "@/components";

// eslint-disable-next-line react-refresh/only-export-components
function FromDidFile({ onSuccess }: { onSuccess: () => void }) {
  const { didAccounts } = useContext(AppContext);
  const [files, setFiles] = useState<File[]>([]);
  const { state }: { state?: DidKeys$Json } = useLocation();
  const [password, setPassword] = useState<string>();
  const [filePassword, setFilePassword] = useState<string>();
  const [way, setWay] = useState<"qr" | "file" | undefined>(
    state ? "qr" : undefined
  );
  const [alias, setAlias] = useState<string>();
  const toast = useToast();

  const [json] = useState<DidKeys$Json | undefined | null>(state);

  const confirmDidFile = useCallback(async () => {
    const notifyError = (err: Error) =>
      toast &&
      toast({
        type: "error",
        message: err.message,
      });
    if (!filePassword || !password) return;

    if (way === "qr") {
      try {
        if (!json) return;
        const account = await didAccounts.importDidFile(json, filePassword);

        await account.storeMeta({ import: true, alias });

        didAccounts.setCurrent(account.instance.id);
        onSuccess();
      } catch (error) {
        notifyError(error as Error);
      }
    } else {
      const file = files[0];

      if (!file) return;

      file
        .text()
        .then(async (text) => {
          const account = await didAccounts.importDidFile(
            JSON.parse(text),
            filePassword
          );

          await account.storeMeta({ import: true, alias });

          didAccounts.setCurrent(account.instance.id);
        })
        .then(() => {
          onSuccess();
        })
        .catch((error) => {
          notifyError(error);
        });
    }
  }, [
    filePassword,
    password,
    way,
    toast,
    json,
    didAccounts,
    alias,
    onSuccess,
    files,
  ]);

  return (
    <form onSubmit={() => void confirmDidFile()}>
      <div>
        {way ? (
          <div className="flex gap-2">
            {way === "file" ? (
              <>
                <div className="text-grey">
                  Import your account with <b>DID-Keys File</b>
                </div>
                <FileUpload
                  accept={{
                    "text/json": [".json"],
                  }}
                  buttonText="Select DID-Keys File"
                  label="DID-Keys File"
                  onChange={setFiles}
                />
              </>
            ) : (
              <div className="flex items-center">
                <AccountIcon size={80} value={json?.didUrl} />
                <div className="border border-primary rounded flex mt-4 p-2 items-center">
                  <div className="rounded mr-2 p-2">DID</div>
                  <AccountName value={json?.didUrl} />
                </div>
              </div>
            )}
            <input
              type="text"
              className="input input-bordered"
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Imported Account"
              tabIndex={1}
            />
            <Password
              placeholder="File Password"
              onChange={setFilePassword}
              tabIndex={2}
            />
            <Password
              placeholder="Wallet Password"
              onChange={setPassword}
              tabIndex={3}
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <button className="flex-1 btn" onClick={() => setWay("file")}>
              Import from DID-keys file
            </button>
            {/* TODO */}
            <button className="flex-1 btn">Import from QR Code</button>
          </div>
        )}
        {/* <QrScanner
          onClose={toggle}
          onOpen={toggle}
          onResult={(type, result) => {
            if (type === 'keys') {
              toggle();
              setJson(result as DidKeys$Json);
              setWay('qr');
            }
          }}
          open={show}
        /> */}
      </div>
      <div>
        <button
          className="btn btn-primary btn-block"
          disabled={!filePassword || !password}
          type="submit"
        >
          Confirm
        </button>
      </div>
    </form>
  );
}

const exportComponent = React.memo(FromDidFile);

export default exportComponent;
