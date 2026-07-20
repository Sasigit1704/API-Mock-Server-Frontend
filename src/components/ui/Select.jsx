import clsx from "clsx";

function Select({
  children,
  className = "",
  ...props
}) {
  return (
    <select
      {...props}
      className="
        h-11
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        text-sm
        transition-all
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
        hover:border-slate-400"
    >
      {children}
    </select>
  );
}

export default Select;