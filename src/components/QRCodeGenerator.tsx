import QRCode from "qrcode-generator";
import { useEffect, useRef } from "react";

interface Props {
  url: string;
  cellSize?: number | undefined | null;
}

const QRCodeGenerator = ({ cellSize, url }: Props) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrCode = QRCode(0, "L");

    qrCode.addData(url);
    qrCode.make();
    qrCode.createImgTag(30);

    if (qrCodeRef.current && cellSize)
      qrCodeRef.current.innerHTML = qrCode.createImgTag(cellSize);
  }, [url, cellSize]);

  return <div ref={qrCodeRef}></div>;
};

export default QRCodeGenerator;
