import { useState } from "react";
import EnterPassword from "./_EnterPassword";
import BackupSeed from "./_BackupSeed";
import Complete from "./_Complete";
import { checkPasswordSecurityLevel } from "@/utils";
import useToast from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import { utils } from "@zcloak/wallet-lib";

export default function RegistByPassword() {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Next");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mnemonic] = useState(utils.mnemonic.mnemonicGenerate(24));
  const [step, setStep] = useState(0);

  const toast = useToast();

  const MainButtonHandle = () => {
    switch (step) {
      case 0:
        if (checkPasswordSecurityLevel(password) < 3) {
          toast &&
            toast({
              value:
                "Password length must be greater than 8 characters, and must contains letters and symbols",
              type: "warning",
            });
        } else if (password !== confirmPassword) {
          toast &&
            toast({
              value: "The two passwords entered do not match",
              type: "warning",
            });
        } else {
          // TODO generate did
          setStep(1);
        }

        break;
      case 1:
        setStep(2);
        setButtonText("Complete");

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
    <div className=" p-10 ">
      <ul className="steps mx-auto mb-8 leading-tight text-xs">
        <li className={`step${step === 0 ? " step-primary text-primary" : ""}`}>
          Enter password
        </li>
        <li className={`step${step === 1 ? " step-primary text-primary" : ""}`}>
          Back up seed phrase
        </li>
        <li className={`step${step === 2 ? " step-primary text-primary" : ""}`}>
          Complete
        </li>
      </ul>
      {step === 0 && (
        <EnterPassword
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
        />
      )}
      {step === 1 && <BackupSeed mnemonic={mnemonic} />}
      {step === 2 && <Complete mnemonic={mnemonic} password={password} />}

      <button
        className="btn w-full btn-primary mt-8"
        onClick={() => MainButtonHandle()}
      >
        {buttonText}
      </button>
    </div>
  );
}
