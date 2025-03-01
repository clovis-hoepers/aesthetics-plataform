const { validationResult } = require('express-validator');
const pool = require('../config/dbConfig');

exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, time, service, name, email, phone } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO appointments (date, time, service, name, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [date, time, service, name, email, phone]
    );
    res.status(201).json({ id: result.insertId, date, time, service, name, email, phone });
  } catch (error) {
    console.error('Failed to create appointment', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};
