import IdentityIcon from "@/components/IdentityIcon";
import { Address } from "@/components";

export default function Complete(props: { didUrl: string }) {
  return (
    <>
      <h1 className="leading-loose font-bold text-xl">
        Your account is now ready!
      </h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          We've prepared your digital identity. Check out its features, use our
          trusted digital cards, and enjoy smooth validations and enhanced
          privacy, all with your data under your control.
        </p>
      </div>
      <div className="text-center py-10">
        <IdentityIcon
          value={props.didUrl}
          className="w-20 h-20 m-auto mask mask-circle bg-[#eee] mb-4"
        />

        <div className="text-base">
          <Address value={props.didUrl} />
        </div>
      </div>
    </>
  );
}
