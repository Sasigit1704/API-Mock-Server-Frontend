import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
  open,
  title = "Confirm Delete",
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
    >
      <div className="space-y-6">

        <p className="text-slate-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <Button
            className="bg-slate-200 text-slate-700 hover:bg-slate-300"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            variant="danger"
            onClick={onConfirm}
          >
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
}

export default ConfirmDialog;