import { useContext } from "react";
import { Context } from "@/context/Toast";

export default () => {
  const { toast } = useContext(Context);

  return toast;
};
