import { DisplayMnemonic } from "@/components";

export default function BackupSeed(props: { mnemonic: string }) {
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
      <DisplayMnemonic mnemonic={props.mnemonic} />
    </>
  );
}
