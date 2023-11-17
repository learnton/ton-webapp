import React, { createContext, useEffect, useState } from "react";
import { DidAccount, DidAccounts } from "@zcloak/wallet-lib";
import useTwaSdk from "@/hooks/useTwaSdk";

interface DidState {
  did: DidAccount | null | undefined;
  didAccounts: DidAccounts | null;
  loading: boolean;
}

export const DidContext = createContext({} as DidState);

const DidProvider = ({ children }: { children: React.ReactNode }) => {
  const { UserInfo } = useTwaSdk();
  const [didAccounts, setDidAccounts] = useState<DidAccounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [did, setDid] = useState<DidAccount | null | undefined>(
    didAccounts?.current
  );

  useEffect(() => {
    if (UserInfo?.id) {
      setLoading(true);
      const _didAccounts = new DidAccounts(String(UserInfo?.id));

      _didAccounts.isReady.then((_d) => {
        setDidAccounts(_d);
        setDid(_d.current);
        setLoading(false);
      });
    } else {
      setDidAccounts(null);
      setDid(null);
      setLoading(false);
    }
  }, [UserInfo?.id]);

  useEffect(() => {
    const currentChanged = (account: DidAccount) => {
      setDid(account);
    };

    didAccounts?.on("current_changed", currentChanged);

    return () => {
      didAccounts?.off("current_changed", currentChanged);
    };
  }, [didAccounts]);

  // useEffect(() => {
  //   if (!did) return;

  //   did.instance.getPublish().then((document) => console.log(document));
  // }, [did]);

  return (
    <>
      <DidContext.Provider
        value={{
          did: didAccounts?.current,
          loading,
          didAccounts,
        }}
      >
        {children}
      </DidContext.Provider>
    </>
  );
};

export default DidProvider;
