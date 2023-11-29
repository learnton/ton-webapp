// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { AppContext } from "@/context/AppProvider";
import { useQueryParam } from "@/hooks";

import FromDidFile from "./FromDidFile";

function Import() {
  // const { didAccounts } = useContext(AppContext);
  // const accounts = didAccounts.current;
  const [redirect] = useQueryParam<string>("redirect");
  const navigate = useNavigate();
  // TODO type of accounts without encryptedMnemonic
  const isGenerated = true; //!!accounts?.encryptedMnemonic;

  const onSuccess = () => {
    navigate(redirect || "/", { replace: true });
  };

  if (isGenerated === undefined) {
    return <></>;
  }

  return <FromDidFile onSuccess={onSuccess} />;
}

export default Import;
