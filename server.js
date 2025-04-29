const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

app.use(express.static('src'));

app.get('/inventory/product', (req, res) => {
  db.query('SELECT * FROM vwproductdetails', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/inventory/total-products', (req, res) => {
  db.query('SELECT SUM(Current_Quantity) AS Total_Products FROM vwTotalProductQuantities', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/inventory/top-selling', (req, res) => {
  db.query('SELECT * FROM vwTopSelling', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/inventory/low-stock', (req, res) => {
  db.query('SELECT * FROM vwLowStock', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/inventory/out-of-stock', (req, res) => {
  db.query('SELECT * FROM vwOutOfStock', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/dash/total-product-quantity', (req, res) => {
  db.query('SELECT * FROM vwtotalproductquantities', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/dash/low-stock', (req, res) => {
  db.query('SELECT * FROM vwlowstock', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/dash/out-of-stock', (req, res) => {
  db.query('SELECT * FROM vwoutofstock', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/report/import', (req, res) => {
  db.query('SELECT * FROM vwimportsummarybydate', (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

app.get('/report/export', (req, res) => {
  db.query('SELECT * FROM vwexportsummarybydate', (err, results) => {
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