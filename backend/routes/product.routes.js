const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const categoryId = req.query.categoryId;

  const offset = (page - 1) * size;

  let where = "";
  let params = [];

  if (categoryId) {
    where = "WHERE p.category_Id = ?";
    params.push(categoryId);
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM products p
    ${where}
  `;

  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / size);

    const dataSql = `SELECT p.product_Id, p.product_Name,
                    c.category_Id, c.category_Name
                    FROM products p
                    JOIN categories c ON p.category_Id = c.category_Id
                    ${where}
                    LIMIT ? OFFSET ? `;

    db.query(
      dataSql,
      [...params, size, offset],
      (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json({
          data: rows,
          totalRecords,
          totalPages,
          currentPage: page
        });
      }
    );
  });
});

// ADD PRODUCT

router.post("/", (req, res) => {
  const { product_Name, category_Id } = req.body;
  db.query(
    "INSERT INTO products (product_Name, category_Id) VALUES (?,?)",
    [product_Name, category_Id],
    () => res.send("Product Added")
  );
});

// EDIT PRODUCT

router.put("/:id", (req, res) => {
  const { product_Name, category_Id } = req.body;
  db.query(
    "UPDATE products SET product_Name=?, category_Id=? WHERE product_Id=?",
    [product_Name, category_Id, req.params.id],
    () => res.send("Product Updated")
  );
});

// DELETE PRODUCT

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE productId=?",
    [req.params.id],
    () => res.send("Product Deleted")
  );
});

module.exports = router;
