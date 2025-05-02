const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'newdb'
});

app.use(express.static('src'));

app.get('/inventory/product', (req, res) => {
  const query = `
    SELECT 
      p.product_number,
      p.product_name,
      c.category_name,
      v.vendor_name,
      p.quantity,
      CASE
          WHEN p.quantity = 0 THEN 'Out of Stock'
          WHEN p.quantity <= p.threshold_limit THEN 'Low Stock'
          ELSE 'In Stock'
      END AS stock_status
    FROM 
      products p
    LEFT JOIN 
      categories c ON p.category_id = c.category_id
    LEFT JOIN 
      vendors v ON p.vendor_number = v.vendor_number;
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/inventory/product-log', (req, res) => {
  const query = `SELECT * from product_quantity_log`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});