// import { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import useTonWalletSign from "@/hooks/useTonWalletSign";

export default function RegistByWallet() {
  const [TonConnectUI] = useTonConnectUI();
  useTonWalletSign();

  const handler = () => {
    TonConnectUI.openModal();
  };

  const disconnect = () => {
    TonConnectUI.disconnect();
  };

  return (
    <div className="p-8">
      <button className="btn" onClick={() => handler()}>
        connect
      </button>
      <button className="btn" onClick={() => disconnect()}>
        disconnect
      </button>
    </div>
  );
}
