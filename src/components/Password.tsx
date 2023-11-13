import { useState } from "react";
import IconEye from "@/assets/img/eye.svg?react";
import IconEyeOff from "@/assets/img/eye-off.svg?react";

export default function Password(props: { [key: string]: any }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        className="input input-secondary w-full pr-10"
        type={show ? "text" : "password"}
        {...props}
      />
      <span
        onClick={() => setShow(!show)}
        className="text-[#363636] absolute right-2 top-3"
      >
        {show ? <IconEye /> : <IconEyeOff />}
      </span>
    </div>
  );
}
