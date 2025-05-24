const db = require('../config/db');

// Получить все датчики
exports.getAllSensors = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Sensor ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении датчиков' });
  }
};

// Получить датчик по ID
exports.getSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM Sensor WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Датчик не найден' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении датчика' });
  }
};

// Создать новый датчик
exports.createSensor = async (req, res) => {
  const { name, type_id, room_id, state_id } = req.body;
  try {
    await db.query(
      'INSERT INTO Sensor (name, type_id, room_id, state_id) VALUES ($1, $2, $3, $4)',
      [name, type_id, room_id, state_id]
    );
    res.status(201).json({ message: 'Датчик создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании датчика' });
  }
};

// Обновить датчик
exports.updateSensor = async (req, res) => {
  const { id } = req.params;
  const { name, type_id, room_id, state_id } = req.body;
  try {
    await db.query(
      'UPDATE Sensor SET name = $1, type_id = $2, room_id = $3, state_id = $4 WHERE id = $5',
      [name, type_id, room_id, state_id, id]
    );
    res.json({ message: 'Датчик обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении датчика' });
  }
};

// Удалить датчик
exports.deleteSensor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Sensor WHERE id = $1', [id]);
    res.json({ message: 'Датчик удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении датчика' });
  }
};
