import React, {
  createContext,
  useReducer,
  useContext,
  useState,
  useEffect,
} from "react";

type AlertType = "info" | "success" | "warning" | "error";

type AlertConfig = {
  type: AlertType;
  message: string;
};

type StoreDispatch = {
  type: AlertType;
  message?: string;
};

const initialState: AlertConfig = { type: "info", message: "" };

function reducer(state: AlertConfig, action: StoreDispatch) {
  const alertType = action.type || "info";
  console.log(state, action);
  const alertParam = {
    type: alertType,
    message: "",
  };
  if (action?.message && action.message.trim()) {
    alertParam.message = action.message;
  }
  return alertParam;
}

const StateContext = createContext(initialState);
const DispatchContext = createContext<React.Dispatch<StoreDispatch> | null>(
  null
);

function useToast() {
  return useContext(DispatchContext);
}

const Toast = () => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const { type, message } = state;
  const [show, setShow] = useState<boolean>(false);

  const position = ["top", "center"];

  useEffect(() => {
    setShow(!!message?.trim());
    if (message?.trim()) {
      setTimeout(() => {
        dispatch && dispatch({ type: "info", message: "" });
      }, 3000);
    }
  }, [dispatch, message]);

  return (
    <>
      <div className="alert alert-info hidden"></div>
      <div className="alert alert-success hidden"></div>
      <div className="alert alert-warning hidden"></div>
      <div className="alert alert-error hidden"></div>

      <div
        className={`toast w-[80vw] whitespace-normal z-50 ${position
          ?.map((position) => "toast-" + position)
          .join(" ")} transition ${show ? "scale-100" : "scale-0"}`}
      >
        <div className={`alert ${"alert-" + type}`}>{message}</div>
      </div>
    </>
  );
};

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
        <Toast />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useToast, ToastProvider };
