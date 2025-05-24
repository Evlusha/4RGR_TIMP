const pool = require('../config/db');

// Получить все комнаты
async function getAllRooms(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM Room ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

// Получить комнату по ID
async function getRoomById(req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM Room WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// Создать комнату
async function createRoom(req, res, next) {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Room(name) VALUES($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// Обновить комнату
async function updateRoom(req, res, next) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const { rowCount } = await pool.query(
      'UPDATE Room SET name = $1 WHERE id = $2',
      [name, id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Updated successfully' });
  } catch (err) {
    next(err);
  }
}

// Удалить комнату
async function deleteRoom(req, res, next) {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM Room WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };