/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppProvider";
import { Password, DisplayMnemonic, useToast } from "@/components";

export default function RecoverySeedPhrase() {
  const { didAccounts: accounts } = useContext(AppContext);
  const [password, setPassword] = useState<string>();
  const [mnemonic, setMnemonic] = useState<string>();
  const navigate = useNavigate();
  const toast = useToast();

  const handleShow = useCallback(async () => {
    if (!password || !accounts?.getMnemonic) return;
    try {
      await accounts.unlock(password);
      const mnemonic = accounts.getMnemonic();
      if (mnemonic) {
        setMnemonic(mnemonic);
      } else {
        return new Error("Get mnemonic error");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast &&
        e &&
        Object.prototype.hasOwnProperty.call(e, "message") &&
        toast({
          type: "error",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          message: e.message,
        });
    }
  }, [password, accounts, toast]);

  return (
    <div className="py-4">
      <h1 className="font-bold text-xl mb-4">Back up your seed phrase</h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          Kindly ensure the secure storage of your 24 words seed phrase, as it
          will be necessary for account recovery. Additionally, refrain from
          sharing it with others, as it could grant unauthorized access to your
          digital assets
        </p>
      </div>
      <div className="py-4">
        {mnemonic ? (
          <DisplayMnemonic mnemonic={mnemonic} />
        ) : (
          <div className="form-control">
            <div className="label">Enter Password</div>
            <Password
              label="Recovery Seed Phrase"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />
          </div>
        )}
      </div>
      <div className="py-4">
        {mnemonic ? (
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate(-1)}
          >
            Confirm
          </button>
        ) : (
          <>
            <button
              disabled={!password}
              className="btn btn-primary btn-block"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleShow}
            >
              Show Seed
            </button>
          </>
        )}
      </div>
    </div>
  );
}
