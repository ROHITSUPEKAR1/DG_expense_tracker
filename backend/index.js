const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST - Add transaction
app.post('/api/transactions', (req, res) => {
  const { client, amount, type, date } = req.body;
  const query = 'INSERT INTO transactions (client, amount, type, created_at) VALUES (?, ?, ?, ?)';
  db.query(query, [client, amount, type, date], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Transaction added!' });
  });
});

// GET - All transactions or filter by date
app.get('/api/transactions', (req, res) => {
  const { start, end } = req.query;
  let query = 'SELECT * FROM transactions';
  let params = [];

  if (start && end) {
    query += ' WHERE DATE(created_at) BETWEEN ? AND ?';
    params = [start, end];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});