const OperationButtons: React.FC<{
  cancelText: string;
  confirmText: string;
  loading: boolean;
  cancel: () => void;
  confirm: () => void;
  disableConfirm?: boolean;
}> = ({
  cancel,
  cancelText,
  confirm,
  confirmText,
  disableConfirm,
  loading,
}) => {
  return (
    <>
      <button className="btn flex-1" disabled={loading} onClick={cancel}>
        {cancelText}
      </button>
      <button
        className="btn flex-1 btn-primary"
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
