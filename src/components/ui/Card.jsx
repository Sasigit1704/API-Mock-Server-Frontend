import clsx from "clsx";

function Card({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;