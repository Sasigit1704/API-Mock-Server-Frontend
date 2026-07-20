import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

function CollectionForm({
  collection,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || "",
        description: collection.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [collection]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Collection Name
        </label>

        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter collection name"
          required
        />

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
          placeholder="Enter description..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">

          {collection
            ? "Update Collection"
            : "Create Collection"}

        </Button>

      </div>

    </form>
  );
}

export default CollectionForm;