const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('./schema');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());
router.use(
  session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }, 
  })
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

      res.cookie("authToken", token, { httpOnly: true, secure: false });
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
  });
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});


router.post('/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const [user] = await pool.execute(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (user.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.session.username = username;
    res.cookie('username', username, { httpOnly: true });
    res.status(200).json({ success: true, message: "Logged in successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in", error: error.message });
  }
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('username');
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error logging out" });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
});


router.get('/fetch/user/:userid', async (req, res) => {
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
], async (req, res) => {
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

router.put('/update/:id', async (req, res) => {
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

router.delete('/del/:id', async (req, res) => {
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
