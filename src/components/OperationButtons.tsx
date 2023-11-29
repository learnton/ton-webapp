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
    <div className="flex gap-2 max-w-[320px]">
      <button
        className="btn flex-1 bg[#8F92A1]"
        disabled={loading}
        onClick={cancel}
      >
        {cancelText}
      </button>
      <button
        className="btn flex-1"
        disabled={loading || disableConfirm}
        onClick={confirm}
      >
        {loading ? <span className="loading loading-spinner"></span> : null}
        {confirmText}
      </button>
    </div>
  );
};

export default OperationButtons;
