import clsx from "clsx";

function Badge({
  children,
  variant = "default",
}) {
  const variants = {
    // HTTP Methods
    get: "bg-blue-100 text-blue-700",
    post: "bg-green-100 text-green-700",
    put: "bg-amber-100 text-amber-700",
    patch: "bg-purple-100 text-purple-700",
    delete: "bg-red-100 text-red-700",

    // STATUS
    active: "bg-green-100 text-green-700",
    inactive: "bg-slate-100 text-slate-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",

    default: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold",
        variants[variant] ?? variants.default
      )}
    >
      {children}
    </span>
  );
}

export default Badge;