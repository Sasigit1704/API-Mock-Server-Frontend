import clsx from "clsx";

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className="
        h-11
        w-full
        rounded-xl
        border
        border-slate-300
        px-4
        text-sm
        placeholder:text-slate-400
        transition-all
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100"
    />
  );
}

export default Input;