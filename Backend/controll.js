const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('./schema'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

router.use(cookieParser());
router.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
  })
);

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("authToken", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error logging out" });
    }
    res.json({ message: "Logout successful" });
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
};

router.get('/fetch/user/:userid', authenticateToken, async (req, res) => {
  try {
    const { userid } = req.params;
    const [userEntities] = await pool.execute(
      "SELECT * FROM data_items WHERE created_by = ?",
      [userid]
    );
    res.status(200).json({ success: true, data: userEntities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user entities', error: error.message });
  }
});

router.post('/create', [
  body('name').notEmpty().withMessage('Please enter the name for the data item'),
  body('time').isFloat({ gt: 0 }).withMessage('Please enter a valid time'),
  body('description').optional().isString(),
  body('created_by').notEmpty().withMessage('User ID is required')
], authenticateToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { name, description, time, created_by } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO data_items (name, description, time, created_by) VALUES (?, ?, ?, ?)",
      [name, description, time, created_by]
    );
    res.status(201).json({ success: true, message: "Created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating data", error: error.message });
  }
});

router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, time } = req.body;
    const { id } = req.params;

    const [result] = await pool.execute(
      "UPDATE data_items SET name = ?, description = ?, time = ? WHERE id = ?",
      [name, description, time, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data item not found' });
    }

    res.status(200).json({ success: true, message: 'Data item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating data item', error: error.message });
  }
});

router.delete('/del/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute("DELETE FROM data_items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data item not found' });
    }

    res.status(200).json({ success: true, message: 'Data item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting data item', error: error.message });
  }
});

module.exports = router;
