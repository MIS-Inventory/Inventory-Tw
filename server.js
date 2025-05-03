const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'newdb'
});

function getCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(
    raw.split('; ').map(cookie => {
      const [key, value] = cookie.split('=');
      return [key, value];
    }).filter(Boolean)
  );
}

function checkAuth(req, res, next) {
  const cookies = getCookies(req);
  if (cookies.loggedIn === 'true') {
    next();
  } else {
    res.sendFile(path.join(__dirname, 'src', 'Login.html'));
  }
}

app.get('/', (req, res) => {
  const cookies = getCookies(req);
  if (cookies.loggedIn === 'true') {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src', 'Login.html'));
  }
});

app.post('/login', (req, res) => {
  res.setHeader('Set-Cookie', 'loggedIn=true; Path=/; HttpOnly');
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'loggedIn=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.redirect('/');
});

app.use(express.static('src'));

app.get('/inventory/product', checkAuth, (req, res) => {
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

app.get('/inventory/product-log', checkAuth, (req, res) => {
  const query = `SELECT * FROM product_quantity_log`;
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
