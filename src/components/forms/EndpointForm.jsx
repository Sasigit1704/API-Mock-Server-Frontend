import { useState, useEffect } from "react";
import { Save, X, Server } from "lucide-react";

import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

function EndpointForm({
  onSave,
  onCancel,
  collections,
  endpoint,
}) {
  const [formData, setFormData] = useState({
    name: "",
    method: "GET",
    path: "",
    statusCode: 200,
    responseBody: "",
    collectionId: "",
    isEnabled: true,
  });

  useEffect(() => {
    if (endpoint) {
      setFormData(endpoint);
    }
  }, [endpoint]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
        alert("Please enter an endpoint name.");
        return;
    }

    if (!formData.path.trim()) {
        alert("Please enter an endpoint path.");
        return;
    }

    if (!formData.collectionId) {
        alert("Please select a collection.");
        return;
    }

    if (!formData.responseBody.trim()) {
        alert("Please enter a response body.");
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
            <Server
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {endpoint ? "Edit Endpoint" : "Create Endpoint"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure your mock API endpoint.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoint Name */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Endpoint Name
        </label>

        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Get Users"
          required
        />
      </div>

      {/* Method + Path */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            HTTP Method
          </label>

          <Select
            name="method"
            value={formData.method}
            onChange={handleChange}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Endpoint Path
          </label>

          <Input
            name="path"
            value={formData.path}
            onChange={handleChange}
            placeholder="/users"
            required
          />
        </div>
      </div>

      {/* Status + Collection */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status Code
          </label>

          <Input
            type="number"
            name="statusCode"
            value={formData.statusCode}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Collection
          </label>

          <Select
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Collection
            </option>

            {collections.map((collection) => (
              <option
                key={collection.id}
                value={collection.id}
              >
                {collection.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Response */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Response Body
        </label>

        <textarea
          name="responseBody"
          value={formData.responseBody}
          onChange={handleChange}
          rows={10}
          placeholder={`{
  "message": "Success"
}`}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Enabled */}

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <input
          id="enabled"
          type="checkbox"
          name="isEnabled"
          checked={formData.isEnabled}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
        />

        <label
          htmlFor="enabled"
          className="text-sm font-medium text-slate-700"
        >
          Endpoint Enabled
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
          {endpoint ? "Update Endpoint" : "Save Endpoint"}
        </Button>
      </div>
    </form>
  );
}

export default EndpointForm;