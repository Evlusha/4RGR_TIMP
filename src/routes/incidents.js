const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // подключение к базе
const authenticate = require('../middlewares/authenticate');


router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
       
        i.description,
        s.name AS sensor_name,
        r.name AS room_name
        
      FROM incident i
      JOIN sensor s ON i.sensor_id = s.id
      JOIN room r ON i.room_id = r.id
      
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении инцидентов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


module.exports = router;
