const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Omkar#8429",
  database: "product_db",
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("DB ERROR:", err);
  } else {
    console.log("MySQL Connected");
    conn.release();
  }
});

module.exports = db;
