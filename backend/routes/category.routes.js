const express = require("express");
const db = require("../db");
const router = express.Router();

//  GET ALL CATEGORIES 

router.get("/", (req, res) => {
  db.query(
    "SELECT category_Id, category_Name FROM categories",
    (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.json(rows);
    }
  );
});

//  ADD CATEGORY 

router.post("/", (req, res) => {
  const { category_Name } = req.body;

  db.query(
    "INSERT INTO categories (category_Name) VALUES (?)",
    [category_Name],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Category Added");
    }
  );
});

//  UPDATE CATEGORY 

router.put("/:id", (req, res) => {
  const { category_Name } = req.body;

  db.query(
    "UPDATE categories SET category_Name=? WHERE category_Id=?",
    [category_Name, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Category Updated");
    }
  );
});

//  DELETE CATEGORY 

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM categories WHERE category_Id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Category Deleted");
    }
  );
});

module.exports = router;