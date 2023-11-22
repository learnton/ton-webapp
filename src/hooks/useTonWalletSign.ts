import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export const useTonWalletSign = function () {
  const [tonConnectUI] = useTonConnectUI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line no-unsafe-optional-chaining
        "proof" in wallet?.connectItems?.tonProof
      ) {
        console.log(wallet.connectItems.tonProof.proof, wallet.account);
      }
    });
  }, [refreshPayload, tonConnectUI]);
};
