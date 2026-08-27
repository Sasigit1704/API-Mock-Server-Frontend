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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (environment) {
      setFormData({
        name: environment.name ?? "",
        baseUrl: environment.baseUrl ?? "",
        description: environment.description ?? "",
        isActive: environment.isActive ?? false,
      });
    } else {
      setFormData({
        name: "",
        baseUrl: "",
        description: "",
        isActive: false,
      });
    }

    setErrors({});
  }, [environment]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Environment name is required.";
    }

    if (!formData.baseUrl.trim()) {
      newErrors.baseUrl =
        "Base URL is required.";
    } else {
      try {
        new URL(formData.baseUrl.trim());
      } catch {
        newErrors.baseUrl =
          "Please enter a valid URL.";
      }
    }

    setErrors(newErrors);

    return newErrors;
  };

  const scrollToFirstError = (validationErrors) => {
    const firstErrorField =
      Object.keys(validationErrors)[0];

    if (!firstErrorField) {
      return;
    }

    const element = document.querySelector(
      `[name="${firstErrorField}"]`
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      scrollToFirstError(
        validationErrors
      );
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      baseUrl: formData.baseUrl.trim(),
      description:
        formData.description.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8"
    >
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Globe
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {environment
                ? "Edit Environment"
                : "Create Environment"}
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Configure a target environment for your mock APIs.
            </p>
          </div>
        </div>
      </div>

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

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Base URL
        </label>

        <Input
          name="baseUrl"
          value={formData.baseUrl}
          onChange={handleChange}
          placeholder="http://localhost:3000"
        />

        {errors.baseUrl && (
          <p className="mt-2 text-sm text-red-600">
            {errors.baseUrl}
          </p>
        )}
      </div>

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

      <div className="rounded-xl bg-slate-50 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />

          <div>
            <p className="font-medium text-slate-800 text-sm sm:text-base">
              Set as Active Environment
            </p>

            <p className="text-xs sm:text-sm text-slate-500">
              Only one environment should be active at a time.
            </p>
          </div>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          <X
            size={18}
            className="mr-2"
          />
          Cancel
        </Button>

        <Button
          type="submit"
          className="w-full sm:w-auto"
        >
          <Save
            size={18}
            className="mr-2"
          />
          {environment
            ? "Update Environment"
            : "Save Environment"}
        </Button>
      </div>
    </form>
  );
}

export default EnvironmentForm;