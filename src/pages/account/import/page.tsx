import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppProvider";
import { useQueryParam } from "@/hooks";

import FromDidFile from "./FromDidFile";

function Import() {
  const { didAccounts } = useContext(AppContext);
  const [redirect] = useQueryParam<string>("redirect");
  const navigate = useNavigate();
  const isGenerated = !!didAccounts.encryptedMnemonic;

  const onSuccess = () => {
    navigate(redirect || "/", { replace: true });
  };

  if (isGenerated === undefined) {
    return <></>;
  }

  return <FromDidFile onSuccess={onSuccess} />;
}

export default Import;
