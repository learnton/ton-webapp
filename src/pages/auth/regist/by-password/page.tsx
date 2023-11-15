import { useState } from "react";
import EnterPassword from "./_EnterPassword";
import BackupSeed from "./_BackupSeed";
import Complete from "./_Complete";
import { useNavigate } from "react-router-dom";
import { utils } from "@zcloak/wallet-lib";
import useDidHelper from "@/hooks/useDidHelper";

export default function RegistByPassword() {
  const { checkConfirmPassword } = useDidHelper();
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Next");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic] = useState(utils.mnemonic.mnemonicGenerate(24));
  const [step, setStep] = useState(0);
  const [runing, setRuning] = useState(false);

  const MainButtonHandle = () => {
    switch (step) {
      case 0:
        checkConfirmPassword(password, confirmPassword, (valid) => {
          valid && setStep(1);
        });

        break;
      case 1:
        setRuning(true);
        setStep(2);
        setButtonText("Complete");

        break;
      case 2:
        console.log('navigate("/")');
        navigate("/");
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
      {step === 2 && (
        <Complete
          mnemonic={mnemonic}
          password={password}
          ready={() => setRuning(false)}
        />
      )}

      <button
        className="btn w-full btn-primary mt-4"
        disabled={runing}
        onClick={() => MainButtonHandle()}
      >
        {runing && <span className="loading loading-spinner"></span>}
        {buttonText}
      </button>
    </div>
  );
}
