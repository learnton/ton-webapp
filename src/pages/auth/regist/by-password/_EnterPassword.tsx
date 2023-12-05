// import Reactfrom "react";
import { Password } from "@/components";

export default function EnterPassword(props: {
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onSubmit?: () => void;
}) {
  return (
    <>
      <h1 className="leading-loose font-bold text-xl">Enter Password</h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          Please kindly follow the requirements below to create your password:
        </p>
      </div>
      <form
        className="py-4"
        onSubmit={() => props.onSubmit && props.onSubmit()}
      >
        <div className="form-control">
          <div className="label">Enter Password</div>
          <Password
            placeholder="Enter Password"
            onChange={(e: { target: HTMLInputElement }) =>
              props.setPassword(e.target.value.trim())
            }
          />
        </div>
        <div className="form-control">
          <div className="label">Confirm Password</div>
          <Password
            placeholder="Confirm Password"
            onChange={(e: { target: HTMLInputElement }) =>
              props.setConfirmPassword(e.target.value.trim())
            }
          />
        </div>
      </form>
      <div className="text-[#9CA3AF]">
        <p>Password Requirements: </p>
        <ul>
          <li>◉ At least one letter (A-Z or a-z)</li>
          <li>◉ At least one number (0-9)</li>
          <li>◉ At least one symbol (!@#$%^&*)</li>
          <li>◉ Minimum 8 characters</li>
        </ul>
        <p>Example: A1b2@c3d</p>
      </div>
    </>
  );
}
