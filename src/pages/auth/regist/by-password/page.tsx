import { useState } from "react";
import EnterPassword from "./_EnterPassword";
import BackupSeed from "./_BackupSeed";
import Complete from "./_Complete";
import { utils } from "@zcloak/wallet-lib";
import useDidHelper from "@/hooks/useDidHelper";
import { useNavigate } from "react-router-dom";
import { DidAccount } from "@zcloak/wallet-lib";

export default function RegistByPassword() {
  const navigate = useNavigate();
  const { checkConfirmPassword, generate } = useDidHelper();
  const [buttonText, setButtonText] = useState("Next");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic] = useState(utils.mnemonic.mnemonicGenerate(24));
  const [step, setStep] = useState(0);
  const [runing, setRuning] = useState(false);
  const [did, setDid] = useState<DidAccount | undefined>();

  const MainButtonHandle = () => {
    switch (step) {
      case 0:
        checkConfirmPassword(password, confirmPassword, (valid) => {
          valid && setStep(1);
        });

        break;
      case 1:
        setRuning(true);

        void generate({
          mnemonic,
          password,
        }).then((did) => {
          if (did) {
            setDid(did);
            setRuning(false);
            setStep(2);
            setButtonText("Complete");
          }
        });

        break;
      case 2:
        navigate("/", {
          replace: true,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className=" p-8 ">
      <ul className="steps mx-auto mb-8 leading-tight text-xs">
        <li className={`step${step >= 0 ? " step-primary text-primary" : ""}`}>
          Enter password
        </li>
        <li className={`step${step >= 1 ? " step-primary text-primary" : ""}`}>
          Back up seed phrase
        </li>
        <li className={`step${step >= 2 ? " step-primary text-primary" : ""}`}>
          Complete
        </li>
      </ul>
      {step === 0 && (
        <EnterPassword
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={() => MainButtonHandle()}
        />
      )}
      {step === 1 && <BackupSeed mnemonic={mnemonic} />}
      {step === 2 && did && <Complete didUrl={did?.instance.id} />}

      <button
        className="btn btn-block btn-primary mt-4"
        disabled={runing}
        onClick={() => MainButtonHandle()}
      >
        {runing && <span className="loading loading-spinner"></span>}
        {buttonText}
      </button>
    </div>
  );
}
