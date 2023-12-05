import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  text: string;
  type?: "error" | "warning" | "success" | "primary";
};

export default function ConfirmDialog(props: Props) {
  const domId = useRef<string>(`my_modal_${Math.round(Math.random() * 1e5)}`);

  useEffect(() => {
    const openModal = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (document.getElementById(domId.current) as any)?.showModal();
    };

    if (props.open) {
      openModal();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (document.getElementById(domId.current) as any)?.close();
    }
  }, [props]);

  return (
    <>
      <dialog id={domId.current} className="modal">
        <div className="modal-box">
          {props.title && (
            <h5 className="font-semibold text-lg -mt-2 mb-2">{props.title}</h5>
          )}
          <div className="py-4">{props.text}</div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() => props.onClose && props.onClose()}
              >
                Cancel
              </button>
            </form>
            <button
              className={
                "btn text-white" +
                (props.type ? ` btn-${props.type}` : " btn-primary")
              }
              onClick={() => props.onConfirm && props.onConfirm()}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
