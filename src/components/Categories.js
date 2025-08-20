import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newAttr, setNewAttr] = useState({ name: "", dataType: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post("http://localhost:8080/api/categories", {
        name: newCategory,
      });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const updateCategory = async (id, name) => {
    if (!name.trim()) return;
    try {
      await axios.put(`http://localhost:8080/api/categories/${id}`, { name });
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const selectCategory = async (cat) => {
    setSelectedCategory(cat);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/categories/${cat.id}/attributes`
      );
      setAttributes(res.data);
    } catch (err) {
      console.error("Error fetching attributes:", err);
    }
  };

  const addAttribute = async () => {
    if (!newAttr.name.trim() || !newAttr.dataType) return;
    try {
      await axios.post(
        `http://localhost:8080/api/categories/${selectedCategory.id}/attributes`,
        newAttr
      );
      setNewAttr({ name: "", dataType: "" });
      selectCategory(selectedCategory);
    } catch (err) {
      console.error("Error adding attribute:", err);
    }
  };

  const updateAttribute = async (attrId, name) => {
    if (!name.trim()) return;
    try {
      await axios.put(
        `http://localhost:8080/api/categories/attributes/${attrId}`,
        { name }
      );
      selectCategory(selectedCategory);
    } catch (err) {
      console.error("Error updating attribute:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex gap-6">
      <div className="w-1/3 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
            onClick={addCategory}
          >
            Add
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b">
                <td className="py-2">
                  <input
                    className="border p-1 rounded w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    value={cat.name}
                    onChange={(e) => {
                      setCategories(
                        categories.map((c) =>
                          c.id === cat.id ? { ...c, name: e.target.value } : c
                        )
                      );
                    }}
                    onBlur={() => updateCategory(cat.id, cat.name)}
                  />
                </td>
                <td className="pl-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => selectCategory(cat)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCategory && (
        <div className="w-2/3 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Attributes of {selectedCategory.name}
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newAttr.name}
              onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
              placeholder="Attribute name"
            />
            <select
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newAttr.dataType}
              onChange={(e) =>
                setNewAttr({ ...newAttr, dataType: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              onClick={addAttribute}
            >
              Add
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.id} className="border-b">
                  <td className="py-2">
                    <input
                      className="border p-1 rounded w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      value={attr.name}
                      onChange={(e) => {
                        setAttributes(
                          attributes.map((a) =>
                            a.id === attr.id
                              ? { ...a, name: e.target.value }
                              : a
                          )
                        );
                      }}
                      onBlur={() => updateAttribute(attr.id, attr.name)}
                    />
                  </td>
                  <td>{attr.dataType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
