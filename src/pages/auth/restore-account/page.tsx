import { MainButton } from "@/hooks/useTwaSdk";
import { useState, useCallback } from "react";

export default function RestoreAccount() {
  const [mnemonic, setMnemonic] = useState<string>("");

  MainButton.init(
    {
      text: "Complete",
    },
    useCallback(() => {
      console.log("Restore account", mnemonic);
    }, [mnemonic])
  );

  return (
    <div className="text-[#9CA3AF] p-10">
      <h1 className="font-bold text-[#111827] text-xl mb-4">
        Enter your seed phrase
      </h1>
      <p className="my-4">
        Please carefully enter your 24 words seed phrase to restore your account
      </p>
      <div className="flex">
        <textarea
          className="textarea textarea-bordered flex-1"
          placeholder="present police twin quality river sail coach link give distance palm paddle"
          rows={4}
          onChange={(e) => setMnemonic(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
