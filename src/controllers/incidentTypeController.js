const db = require('../config/db');

// Получить все типы инцидентов
exports.getAllIncidentTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM IncidentType ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении типов инцидентов' });
  }
};

// Получить тип инцидента по ID
exports.getIncidentTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM IncidentType WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Тип инцидента не найден' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении типа инцидента' });
  }
};

// Создать новый тип инцидента
exports.createIncidentType = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO IncidentType (name) VALUES ($1)', [name]);
    res.status(201).json({ message: 'Тип инцидента создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании типа инцидента' });
  }
};

// Обновить тип инцидента
exports.updateIncidentType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.query('UPDATE IncidentType SET name = $1 WHERE id = $2', [name, id]);
    res.json({ message: 'Тип инцидента обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении типа инцидента' });
  }
};

// Удалить тип инцидента
exports.deleteIncidentType = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM IncidentType WHERE id = $1', [id]);
    res.json({ message: 'Тип инцидента удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении типа инцидента' });
  }
};
