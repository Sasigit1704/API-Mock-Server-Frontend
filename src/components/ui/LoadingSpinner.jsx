import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="flex h-80 items-center justify-center">
      <Loader2
        className="h-8 w-8 animate-spin text-blue-600"
      />
    </div>
  );
}

export default LoadingSpinner;