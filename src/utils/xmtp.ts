import TonWeb from "tonweb";
export function requestPhaseText(phase: Uint8Array) {
  const bytesHex = TonWeb.utils.bytesToHex(phase);

  return `zkID: Enable W3C DID\n${bytesHex}\n\nMore information: https://github.com/zCloak-Network/zk-did-method-specs`;
}

export function generateBindText(didUrl: string, prefix: string, time: number) {
  return `${prefix}--${didUrl}--${time}`;
}
