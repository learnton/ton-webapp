import QRCode from "qrcode-generator";
import { useEffect, useRef } from "react";

interface Props {
  data: string | string[];
  cellSize?: number | null;
  margin?: number;
}

const QRCodeGenerator = ({ cellSize, data, margin }: Props) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrCode = QRCode(0, "L");
    if (Array.isArray(data)) {
      data.forEach((d) => typeof d === "string" && qrCode.addData(d));
    } else if (typeof data === "string") {
      qrCode.addData(data);
    }

    qrCode.make();

    if (qrCodeRef.current && cellSize)
      qrCodeRef.current.innerHTML = qrCode.createImgTag(cellSize, margin);
  }, [data, cellSize, margin]);

  return <div ref={qrCodeRef}></div>;
};

export default QRCodeGenerator;
