import { useEffect, useState } from "react";
import { Globe, Save, X } from "lucide-react";

import Input from "../ui/Input";
import Button from "../ui/Button";

function EnvironmentForm({
  environment,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    baseUrl: "",
    description: "",
    isActive: false,
  });

  useEffect(() => {
    if (environment) {
      setFormData({
        name: environment.name ?? "",
        baseUrl: environment.baseUrl ?? "",
        description: environment.description ?? "",
        isActive: environment.isActive ?? false,
      });
    }
  }, [environment]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter an environment name.");
      return;
    }

    if (!formData.baseUrl.trim()) {
      alert("Please enter a base URL.");
      return;
    }

    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Header */}

      <div className="border-b border-slate-200 pb-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">

            <Globe
              size={22}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {environment
                ? "Edit Environment"
                : "Create Environment"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure a target environment for your
              mock APIs.
            </p>

          </div>

        </div>

      </div>

      {/* Environment Name */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Environment Name
        </label>

        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Development"
        />

      </div>

      {/* Base URL */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Base URL
        </label>

        <Input
          name="baseUrl"
          value={formData.baseUrl}
          onChange={handleChange}
          placeholder="http://localhost:5000"
        />

      </div>

      {/* Description */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Environment description..."
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            text-sm
            transition
            focus:border-blue-500
            focus:outline-none
            focus:ring-4
            focus:ring-blue-100
          "
        />

      </div>

      {/* Active */}

      <div className="rounded-xl bg-slate-50 p-4">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />

          <div>

            <p className="font-medium text-slate-800">
              Set as Active Environment
            </p>

            <p className="text-sm text-slate-500">
              Only one environment should be active at
              a time.
            </p>

          </div>

        </label>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          <X size={18} />
          Cancel
        </Button>

        <Button type="submit">
          <Save size={18} />

          {environment
            ? "Update Environment"
            : "Save Environment"}

        </Button>

      </div>

    </form>
  );
}

export default EnvironmentForm;