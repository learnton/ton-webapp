// import { login } from "@/api/sample";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center p-4 h-[100vh] gap-8">
      <div className="text-[#9CA3AF]">
        <h1 className="font-bold text-[#111827] text-xl mb-4">
          Welcome to Product Name
        </h1>
        We&apos;ve prepared your digital identity. Check out its features, use
        our trusted digital cards, and enjoy smooth validations and enhanced
        privacy, all with your data under your control.
      </div>

      <div className="flex flex-col gap-4">
        <button
          className="btn btn-primary font-normal"
          onClick={() => navigate("/regist/password")}
        >
          Register with password
        </button>

        {/* <button
          className="link link-hover link-primary font-normal"
          onClick={() => navigate("/regist/password")}
        >
          Register with password
        </button> */}
      </div>
      <div className="divider">OR</div>
      <div className="text-center leading-loose">
        <p>Have an account with us already?</p>
        <button className="link" onClick={() => navigate("/restore")}>
          Restore Account
        </button>
      </div>
    </div>
  );
}
