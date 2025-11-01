const pool = require('../Config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
   try {
    const { username, email, mobilenumber, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, mobilenumber, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, email, mobilenumber', [username, email, mobilenumber, hashed]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) { 
    next(err);
 }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '70' });
    res.json({ token, user });
  } catch (err) { next(err); }
};


module.exports = {register, login};