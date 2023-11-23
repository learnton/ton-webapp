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

  const colorMap: Record<AlertType, { bg: string; color: string }> = {
    info: {
      bg: "#C7D8FA",
      color: "#002847",
    },
    success: {
      bg: "#DBF1E4",
      color: "#05391B",
    },
    warning: {
      bg: "#FFF6DE",
      color: "#59290C",
    },
    error: {
      bg: "#FBE8E8",
      color: "#A81616",
    },
  };

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
      <div
        className={`fixed left-0 w-full top-0 z-50 transition ${
          show ? "scale-100" : "scale-0"
        }`}
      >
        <div
          className="p-4"
          style={{
            backgroundColor: colorMap[type].bg,
            color: colorMap[type].color,
          }}
        >
          {message}
        </div>
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
