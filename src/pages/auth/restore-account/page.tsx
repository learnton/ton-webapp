import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function RestoreAccount() {
  useEffect(() => {
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(() => {
      console.log("Restore account");
    });
  }, []);

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
        ></textarea>
      </div>
    </div>
  );
}
