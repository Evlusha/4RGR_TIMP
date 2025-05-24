const db = require('../config/db');

// Получить все инциденты
exports.getAllIncidents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Incident ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения инцидентов:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить инцидент по ID
exports.getIncidentById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM Incident WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Инцидент не найден' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения инцидента:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать новый инцидент и включить свет в комнате, отправить уведомление
exports.createIncident = async (req, res) => {
  const { sensorId, roomId, description, typeId } = req.body;

  if (!sensorId || !roomId || !typeId) {
    return res.status(400).json({ error: 'sensorId, roomId и typeId обязательны' });
  }

  try {
    const desc = description || 'Симулированное вторжение';

    // Получаем новый id как max + 1 (если не используешь SERIAL/SEQUENCE)
    const idResult = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM Incident');
    const newId = idResult.rows[0].newid;

    await db.query(
      'INSERT INTO Incident (id, type_id, sensor_id, sensor_state_id, room_id, description) VALUES ($1, $2, $3, $4, $5, $6)',
      [newId, typeId, sensorId, 1 /*пример sensor_state_id*/, roomId, desc]
    );

    await db.query('UPDATE Room SET light_on = true WHERE id = $1', [roomId]);

    const io = req.app.get('io');
    if (io) {
      io.emit('intrusion', { roomId, sensorId, description: desc });
    }

    res.status(201).json({ message: 'Инцидент зафиксирован, свет включён и уведомления отправлены' });
  } catch (err) {
    console.error('Ошибка создания инцидента:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить инцидент
exports.updateIncident = async (req, res) => {
  const id = req.params.id;
  const { type_id, sensor_id, sensor_state_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE Incident SET type_id = $1, sensor_id = $2, sensor_state_id = $3 WHERE id = $4',
      [type_id, sensor_id, sensor_state_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Инцидент не найден' });
    }

    res.json({ message: 'Инцидент обновлён' });
  } catch (err) {
    console.error('Ошибка обновления инцидента:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить инцидент
exports.deleteIncident = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM Incident WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Инцидент не найден' });
    }
    res.json({ message: 'Инцидент удалён' });
  } catch (err) {
    console.error('Ошибка удаления инцидента:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
