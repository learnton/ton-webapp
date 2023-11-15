import { useContext } from "react";
// import { Link } from "react-router-dom";
import { DidContext } from "@/context/Did";

export default function Dashboard() {
  const { did } = useContext(DidContext);

  return (
    <>
      <div className="break-all">did: {did?.instance.id}</div>
    </>
  );
}
