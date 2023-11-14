import { useState } from "react";
import EnterPassword from "./_EnterPassword";
import BackupSeed from "./_BackupSeed";
import { MainButton } from "@/hooks/useTwaSdk";
import { checkPasswordSecurityLevel } from "@/utils";
import useToast from "@/hooks/useToast";

export default function RegistByPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
          setStep(1);
          MainButton.setParams({
            text: "Complete",
          });
        }

        break;
      case 1:
        console.log("register");
        break;
      default:
        break;
    }
  };

  MainButton.init(
    {
      text: "Next",
    },
    MainButtonHandle
  );

  return (
    <div className=" p-10 ">
      <ul className="steps mx-auto mb-8">
        <li
          className="step step-primary text-primary"
          onClick={() => MainButtonHandle()}
        >
          Enter password
        </li>
        <li className="step">Back up seed phrase</li>
      </ul>
      {step === 0 && (
        <EnterPassword
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
        />
      )}
      {step === 1 && (
        <BackupSeed mnemonic="sfs sdf sdfds dsfds fsdfsd sdsd sd" />
      )}
    </div>
  );
}
