import qrcode from "qrcode-generator";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@/context/AppProvider";

const Code = ({
  accountId,
  cellSize = 5,
}: {
  cellSize?: number;
  accountId: `did:zk:${string}`;
}) => {
  const { didAccounts } = useContext(AppContext);
  const qr = useRef(qrcode(0, "L"));
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      qr.current = qrcode(0, "L");

      if (didAccounts) {
        // const json = didAccounts.exportDidFile(accountId);

        qr.current.addData(accountId);
        qr.current.make();
      }

      if (container.current)
        container.current.innerHTML = qr.current.createImgTag(cellSize);
    }, 100);
  }, [accountId, didAccounts, cellSize]);

  return <div className="CredentialQrcode" ref={container} />;
};

export default Code;
