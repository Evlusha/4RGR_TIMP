const db = require('../config/db');

// Получить все статусы
exports.getAllStatuses = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM SensorStatus ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении статусов' });
  }
};

// Создать новый статус
exports.createStatus = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO SensorStatus (name) VALUES ($1)', [name]);
    res.status(201).json({ message: 'Статус создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании статуса' });
  }
};

// Обновить статус
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.query('UPDATE SensorStatus SET name = $1 WHERE id = $2', [name, id]);
    res.json({ message: 'Статус обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
};

// Удалить статус
exports.deleteStatus = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM SensorStatus WHERE id = $1', [id]);
    res.json({ message: 'Статус удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении' });
  }
};
