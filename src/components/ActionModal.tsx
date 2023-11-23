import React, { useEffect } from "react";

type Props = {
  onClose?: () => void;
  open: boolean;
  children: React.ReactNode;
};

export default function ActionModal(props: Props) {
  const domId = `my_modal_${Math.round(Math.random() * 1e5)}`;

  const openModal = () => {
    (document.getElementById(domId) as any)?.showModal();
  };
  useEffect(() => {
    if (props.open) {
      openModal();
    }
  }, [props]);

  return (
    <>
      <dialog id={domId} className="modal">
        <div className="modal-box w-full max-w-full">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => props.onClose && props.onClose()}
            >
              ✕
            </button>
          </form>
          {props.children}
        </div>
      </dialog>
    </>
  );
}
