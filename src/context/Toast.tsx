import React, { useState, createContext } from "react";

interface Props {
  position?: string[];
  type?: string | null;
  value?: string | null;
  children?: React.ReactNode;
  toast?: (params: Props) => void;
}

export const Context = createContext({} as Props);

const Toast: React.FC<Props> = (props) => {
  const [show, setShow] = useState<boolean>(false);

  const [position, setPosition] = useState<string[] | undefined>(
    props.position || ["top", "center"]
  );
  const [type, setType] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const toast = (params: {
    position?: string[];
    type?: string | null;
    value?: string | null;
  }) => {
    setPosition(params.position || ["top", "center"]);
    setType(params.type || null);
    setValue(params.value || null);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  return (
    <>
      <Context.Provider
        value={{
          position: ["top", "center"],
          type: null,
          value: null,
          toast,
        }}
      >
        {props.children}
      </Context.Provider>
      <div
        className={`toast ${position?.join(" ")} transition ${
          show ? "scale-100" : "hidden scale-0"
        }`}
      >
        <div className={`alert${type ? " alert-" + type : ""}`}>{value}</div>
      </div>
    </>
  );
};

export default Toast;
