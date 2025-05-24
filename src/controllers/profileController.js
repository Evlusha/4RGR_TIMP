// src/controllers/profileController.js
const db = require('../config/db'); // путь к подключению к базе (уточни, если другой)

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT id, fio, login, email, telefon FROM operator WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { fio, email, telefon } = req.body;

  try {
    const result = await db.query(
      'UPDATE operator SET fio = $1, email = $2, telefon = $3 WHERE id = $4 RETURNING id, fio, login, email, telefon',
      [fio, email, telefon, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка обновления профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
