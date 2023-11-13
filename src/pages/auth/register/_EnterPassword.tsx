// import Reactfrom "react";
import { Password } from "@/components";

export default function EnterPassword(props: {
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
}) {
  console.log(props);
  return (
    <>
      <h1 className="leading-loose font-bold text-xl">Enter Password</h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          Please kindly follow the requirements below to create your password:
        </p>
        <p>Password Requirements: </p>
        <ul>
          <li>◉ At least one uppercase letter (A-Z)</li>
          <li>◉ At least one lowercase letter (a-z)</li>
          <li>◉ At least one number (0-9)</li>
          <li>◉ At least one symbol (!@#$%^&*)</li>
          <li>◉ Minimum 8 characters</li>
        </ul>
        <p>Example: A1b2@c3d</p>
      </div>
      <form>
        <div className="form-control">
          <div className="label">Enter Password</div>
          <Password
            placeholder="Enter Password"
            onInput={(e: any) => props.setPassword(e.target.value)}
          />
        </div>
        <div className="form-control">
          <div className="label">Confirm Password</div>
          <Password
            placeholder="Confirm Password"
            onInput={(e: any) => props.setConfirmPassword(e.target.value)}
          />
        </div>
      </form>
    </>
  );
}
