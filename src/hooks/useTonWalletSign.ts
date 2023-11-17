import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export default function () {
  const [tonConnectUI] = useTonConnectUI();
  const refreshPayload = (payload = "123456") => {
    tonConnectUI.setConnectRequestParameters({ state: "loading" });

    tonConnectUI.setConnectRequestParameters({
      state: "ready",
      value: {
        tonProof: payload,
      },
    });
  };

  useEffect(() => {
    refreshPayload();

    tonConnectUI.onStatusChange((wallet) => {
      console.log("onStatusChange", wallet);
      if (
        wallet?.connectItems?.tonProof &&
        "proof" in wallet?.connectItems?.tonProof
      ) {
        console.log(wallet.connectItems.tonProof.proof, wallet.account);
      }
    });
  }, []);
}
