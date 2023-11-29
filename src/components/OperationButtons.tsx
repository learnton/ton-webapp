type Props = {
  cancel: () => void;
  cancelText: string;
  confirm: () => void;
  confirmText: string;
  disableConfirm?: boolean;
  loading?: boolean;
};

const OperationButtons = ({
  cancel,
  cancelText,
  confirm,
  confirmText,
  disableConfirm,
  loading,
}: Props) => {
  return (
    <>
      <button className="flex-1 btn" disabled={loading} onClick={cancel}>
        {cancelText}
      </button>
      <button
        className="flex-1 btn btn-primary"
        disabled={loading || disableConfirm}
        onClick={confirm}
      >
        {loading ? <span className="loading loading-spinner"></span> : null}
        {confirmText}
      </button>
    </>
  );
};

export default OperationButtons;
