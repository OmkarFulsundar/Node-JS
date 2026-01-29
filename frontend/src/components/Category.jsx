import { useEffect, useState } from "react";
import api from "../api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadCategories = () => {
    api.get("/categories")
      .then(res => setCategories(res.data));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const saveCategory = () => {
    const payload = { category_Name: categoryName };

    const req = editId
      ? api.put(`/categories/${editId}`, payload)
      : api.post("/categories", payload);

    req.then(() => {
      setEditId(null);
      setCategoryName("");
      loadCategories();
    });
  };

  const editCategory = (c) => {
    setEditId(c.category_Id);
    setCategoryName(c.category_Name);
  };

  const deleteCategory = (id) => {
    api.delete(`/categories/${id}`).then(loadCategories);
  };

  // 🔹 SPLIT DATA
  const firstPart = categories.slice(0, 7);
  const secondPart = categories.slice(7, 14);

  const renderTable = (data) => (
    <table border="1" cellPadding="8" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Category Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(c => (
          <tr key={c.category_Id}>
            <td>{c.category_Id}</td>
            <td>{c.category_Name}</td>
            <td>
              <button onClick={() => editCategory(c)}>Edit</button>
              <button
                onClick={() => deleteCategory(c.category_Id)}
                style={{ marginLeft: 5 }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Category Master</h2>

      {/* Form */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          placeholder="Category Name"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />

        <button onClick={saveCategory} style={{ marginLeft: 10 }}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Side-by-Side Tables */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "0 10rem"
        }}
      >
        <div style={{ width: "50%" }}>
          <h3 style={{ textAlign: "center" }}>Categories 1 - 7</h3>
          {renderTable(firstPart)}
        </div>

        <div style={{ width: "50%" }}>
          <h3 style={{ textAlign: "center" }}>Categories 8 - 14</h3>
          {renderTable(secondPart)}
        </div>
      </div>
    </>
  );
}

export default Category;
