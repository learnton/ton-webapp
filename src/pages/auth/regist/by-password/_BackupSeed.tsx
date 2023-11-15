import { useState } from "react";
import IconEye from "@/assets/img/eye.svg?react";
import IconEyeOff from "@/assets/img/eye-off.svg?react";
import { useCopyToClipboard } from "react-use";

export default function BackupSeed(props: { mnemonic: string }) {
  const [show, setShow] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const handleCopy = () => {
    copyToClipboard(props.mnemonic);
  };

  return (
    <>
      <h1 className="leading-loose font-bold text-xl">
        Back up your seed phrase
      </h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          Kindly ensure the secure storage of your seed phrase, as it will be
          necessary for account recovery. Additionally, refrain from sharing it
          with others, as it could grant unauthorized access to your digital
          assets
        </p>
      </div>
      <div className="relative mt-4 border rounded overflow-hidden">
        <textarea
          className={"block textarea w-full" + (!show ? " blur" : "")}
          placeholder="present police twin quality river sail coach link give distance palm paddle"
          rows={4}
          value={props.mnemonic}
          readOnly
        ></textarea>
        <span
          onClick={() => setShow(!show)}
          className="text-[#363636] absolute p-4 right-0 bottom-0 z-50"
        >
          {show ? <IconEye /> : <IconEyeOff />}
        </span>
      </div>
      <div
        className={`float-right${state.value ? " tooltip" : ""}`}
        data-tip={state.value ? "Copied" : ""}
      >
        <button className="btn btn-ghost " onClick={() => handleCopy()}>
          Copy
        </button>
      </div>
    </>
  );
}
