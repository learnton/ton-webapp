// import { useEffect } from "react";
// import { login } from "@/api/sample";
import { useNavigate } from "react-router-dom";
import IdentityIcon from "@/components/IdentityIcon";
import { MainButton } from "@/hooks/useTwaSdk";

export default function Login() {
  const navigate = useNavigate();

  // const handleSubmit = (e: Event) => {
  //   e.preventDefault();

  //   login({
  //     username: "test",
  //     password: "123456",
  //   }).then(() => {
  //     console.log("submit");
  //     localStorage.setItem("token", "123456");
  //     navigate("/");
  //   });
  // };

  const MainButtonHandle = () => {
    console.log("login page");
  };

  MainButton(
    {
      text: "Login",
    },
    MainButtonHandle
  );

  return (
    <div className="flex flex-col justify-center p-10 h-[100vh] gap-8">
      <div className="text-[#9CA3AF]">
        <h1 className="font-bold text-[#111827] text-xl mb-4">
          Welcome to Product Name
        </h1>
        We've prepared your digital identity. Check out its features, use our
        trusted digital cards, and enjoy smooth validations and enhanced
        privacy, all with your data under your control.
      </div>

      <div className="text-center">
        <IdentityIcon
          value={"did:zk:0xfhskfjsdlfjy6868sdfhk"}
          className="w-20 h-20 m-auto mask mask-circle bg-[#eee] mb-4"
        />

        <div className="text-base">did:zk:0xfhskfjsdlfjy6868sdfhk</div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          className="btn btn-primary font-normal"
          onClick={() => navigate("/register")}
        >
          Register with password
        </button>
      </div>
      <div className="divider">OR</div>
      <div className="text-center leading-loose">
        Have an account with us already?
        <button className="link" onClick={() => navigate("/restore")}>
          Restore Account
        </button>
      </div>
    </div>
  );
}
