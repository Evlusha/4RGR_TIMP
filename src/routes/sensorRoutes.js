const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Получить все датчики
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.id, s.name, s.type_id, s.room_id, s.state_id,
             stype.name AS type_name,
             r.name AS room_name,
             sstatus.name AS status_name
      FROM Sensor s
      JOIN SensorType stype ON s.type_id = stype.id
      JOIN Room r ON s.room_id = r.id
      JOIN SensorStatus sstatus ON s.state_id = sstatus.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Ошибка при получении датчиков:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ЭНДПОИНТ: Получить список типов датчиков
router.get('/types', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM SensorType');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения типов:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ЭНДПОИНТ: Получить список статусов датчиков
router.get('/states', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM SensorStatus');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения статусов:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// (Опционально) Получить комнаты прямо отсюда
router.get('/rooms', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM Room');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения комнат:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить новый датчик
router.post('/', async (req, res) => {
  const { name, type_id, room_id, state_id } = req.body;
  if (!name || !type_id || !room_id || !state_id) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const maxIdRes = await db.query('SELECT MAX(ID) as max FROM Sensor');
    const newId = (maxIdRes.rows[0].max || 0) + 1;

    const result = await db.query(
      'INSERT INTO Sensor (ID, name, type_id, room_id, state_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, name, type_id, room_id, state_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Ошибка при создании датчика:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить датчик
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type_id, room_id, state_id } = req.body;

  if (isNaN(id) || !name || !type_id || !room_id || !state_id) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const result = await db.query(
      'UPDATE Sensor SET name = $1, type_id = $2, room_id = $3, state_id = $4 WHERE id = $5 RETURNING *',
      [name, type_id, room_id, state_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Датчик не найден' });
    }

    res.json({ message: 'Датчик обновлён', sensor: result.rows[0] });
  } catch (err) {
    console.error('❌ Ошибка при обновлении датчика:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить датчик
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Запрос на удаление датчика с id:', id);

  if (isNaN(id)) {
    console.log('❗ Некорректный id');
    return res.status(400).json({ message: 'Некорректный id' });
  }

  try {
    const result = await db.query('DELETE FROM Sensor WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      console.warn('⚠️ Ничего не удалено. Возможно, такого id нет.');
      return res.status(404).json({ message: 'Датчик не найден' });
    }

    console.log('✅ Удалён датчик с id:', id);
    res.json({ message: 'Датчик удалён' });
  } catch (err) {
    console.error('❌ Ошибка при удалении датчика:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
