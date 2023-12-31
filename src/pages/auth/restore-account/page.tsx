import { useState, useContext } from "react";
import { useDidHelper } from "@/hooks";
import { reloadToIndex } from "@/utils";
import { Password, useToast } from "@/components";
import { useBind } from "@/pages/auth/_utils";
import { AppContext } from "@/context/AppProvider";

export default function RestoreAccount() {
  const toast = useToast();
  const { checkConfirmPassword, generate } = useDidHelper();
  const [mnemonic, setMnemonic] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const bind = useBind();
  const { didAccounts } = useContext(AppContext);

  const onSubmit = () => {
    if (!mnemonic.trim().length) {
      toast &&
        toast({
          type: "warning",
          message: "Please enter your mnemonic",
        });
    } else {
      checkConfirmPassword(password, confirmPassword, (valid) => {
        if (valid) {
          void generate({
            password,
            mnemonic,
          }).then((did) => {
            if (did) {
              void didAccounts.unlock(password);
              void bind(did).then(() => {
                reloadToIndex();
              });
            }
          });
        }
      });
    }
  };

  return (
    <div className="text-[#9CA3AF] p-4">
      <h1 className="font-bold text-[#111827] text-xl mb-4">
        Enter your seed phrase
      </h1>
      <p className="my-4">
        Please carefully enter your 24 words seed phrase to restore your account
      </p>
      <div className="flex flex-col gap-4 my-4">
        <textarea
          className="textarea textarea-bordered flex-1"
          placeholder="present police twin quality river sail coach link give distance palm paddle"
          rows={4}
          onChange={(e) => setMnemonic(e.target.value)}
        ></textarea>
        <form className="py-4" onSubmit={() => onSubmit()}>
          <div className="form-control">
            <div className="label">Enter Password</div>
            <Password
              placeholder="Enter Password"
              onChange={(e: { target: EventTarget & HTMLInputElement }) =>
                setPassword(e.target.value.trim())
              }
            />
          </div>
          <div className="form-control">
            <div className="label">Confirm Password</div>
            <Password
              placeholder="Confirm Password"
              onChange={(e: { target: EventTarget & HTMLInputElement }) =>
                setConfirmPassword(e.target.value.trim())
              }
            />
          </div>
        </form>
      </div>
      <button
        className="btn btn-block btn-primary"
        onClick={() => {
          onSubmit();
        }}
      >
        Complete
      </button>
    </div>
  );
}
