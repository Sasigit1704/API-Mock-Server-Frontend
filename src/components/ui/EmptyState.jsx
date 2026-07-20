import { FileText } from "lucide-react";

import Button from "./Button";

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

        <FileText
          size={40}
          className="text-slate-400"
        />

      </div>

      <h2 className="mb-3 text-2xl font-bold text-slate-900">

        {title}

      </h2>

      <p className="mb-8 max-w-md text-slate-500">

        {description}

      </p>

      {buttonText && (
        <Button onClick={onClick}>
          {buttonText}
        </Button>
      )}

    </div>
  );
}

export default EmptyState;