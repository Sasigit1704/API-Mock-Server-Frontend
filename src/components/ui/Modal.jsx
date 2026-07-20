import { X } from "lucide-react";

function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="flex ms-center justify-center text-slate-500 p-1 hover:bg-red-100 hover:text-red-600" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        <div className="p-8 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;