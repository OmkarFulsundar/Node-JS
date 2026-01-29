import { useEffect, useState } from "react";
import api from "../api";

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const size = 10;

  const loadData = () => {
    api.get(`/products?page=${page}&size=${size}`)
      .then(res => {
        setProducts(res.data.data);
        if (res.data.totalPages) {
          setTotalPages(res.data.totalPages);
        }
      });

    api.get("/categories")
      .then(res => setCategories(res.data));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const saveProduct = () => {
    const payload = { productName, categoryId };

    const req = editId
      ? api.put(`/products/${editId}`, payload)
      : api.post("/products", payload);

    req.then(() => {
      setEditId(null);
      setProductName("");
      setCategoryId("");
      loadData();
    });
  };

  const editProduct = (p) => {
    setEditId(p.product_Id);
    setProductName(p.product_Name);
    setCategoryId(p.category_Id);
  };

  const deleteProduct = (id) => {
    api.delete(`/products/${id}`).then(loadData);
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Product List</h2>

      <div style={{ textAlign: "center", marginBottom: 20 }}>

        <input placeholder="Product Name" value={productName}
          onChange={e => setProductName(e.target.value)} />

        <select value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          style={{ marginLeft: 10 }} >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.category_Id} value={c.category_Id}>
              {c.category_Name}
            </option>
          ))}
        </select>

        <button onClick={saveProduct} style={{ marginLeft: 10 }}>
          {editId ? "Update" : "Add"} </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_Id}>
                <td>{p.product_Id}</td>
                <td>{p.product_Name}</td>
                <td>{p.category_Id}</td>
                <td>{p.category_Name}</td>
                <td>
                  <button onClick={() => editProduct(p)}>Edit</button>
                  <button
                    onClick={() => deleteProduct(p.product_Id)}
                    style={{ marginLeft: 5 }}  >
                    Delete
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: 15 }}>
        <button disabled={page === 1} onClick={() => 
          setPage(page - 1)}>  Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages} </span>

        <button disabled={page === totalPages} onClick={() => 
          setPage(page + 1)}> Next
        </button>
      </div>
    </>
  );
}

export default Product;