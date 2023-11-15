import { useState } from "react";
import useDidHelper from "@/hooks/useDidHelper";
import { useNavigate } from "react-router-dom";

export default function RestoreAccount() {
  const navigate = useNavigate();
  const { checkConfirmPassword, generate } = useDidHelper();
  const [mnemonic, setMnemonic] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onSubmit = () => {
    checkConfirmPassword(password, confirmPassword, (valid) => {
      if (valid) {
        generate({
          password,
          mnemonic,
        }).then((did) => {
          did &&
            navigate("/", {
              replace: true,
            });
        });
      }
    });
  };

  return (
    <div className="text-[#9CA3AF] p-8">
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
            <input
              className="input input-secondary w-full"
              type="password"
              placeholder="Enter Password"
              onChange={(e: any) => setPassword(e.target.value.trim())}
            />
          </div>
          <div className="form-control">
            <div className="label">Confirm Password</div>
            <input
              className="input input-secondary w-full"
              type="password"
              placeholder="Confirm Password"
              onChange={(e: any) => setConfirmPassword(e.target.value.trim())}
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
