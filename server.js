const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection pool setup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres',
  user: 'postgres',
  password: 'admin'
});

// Route to get all users from the database
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users from the database' });
  }
});

// Route to create a new user (INSERT INTO the database)
app.post('/users', async (req, res) => {
  const {employeename } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (employeename) VALUES ($1) RETURNING *',
      [employeename]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user in the database' });
  }
});

// Route to get a single user by ID from the database
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.employeeid, 10);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user from the database' });
  }
});

// Route to update a user by ID in the database
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { employeename } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET employeename = $1 WHERE employeeid = $2 RETURNING *',
      [employeename, userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user in the database' });
  }
});

// Route to delete a user by ID from the database
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const result = await pool.query('DELETE FROM users WHERE employeeid = $1 RETURNING *', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user from the database' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Web service running at http://localhost:${port}`);
});
