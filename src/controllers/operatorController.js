const db = require('../config/db');

// Получить всех операторов
exports.getAllOperators = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Operator ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении операторов' });
  }
};
// Получить оператора по ID
exports.getOperatorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM Operator WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Оператор не найден' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении оператора' });
  }
};

// ✅ Получить профиль текущего пользователя
exports.getCurrentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, fio, telefon, email, login FROM Operator WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Профиль не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении профиля' });
  }
};
// Создать нового оператора
exports.createOperator = async (req, res) => {
  const { FIO, Telefon, Login, HPassword, Email } = req.body;
  try {
    await db.query(
      'INSERT INTO Operator (FIO, Telefon, Login, HPassword, Email) VALUES ($1, $2, $3, $4, $5)',
      [FIO, Telefon, Login, HPassword, Email]
    );
    res.status(201).json({ message: 'Оператор создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании оператора' });
  }
};

// Обновить оператора
exports.updateOperator = async (req, res) => {
  const { id } = req.params;
  const { FIO, Telefon, Login, HPassword, Email } = req.body;
  try {
    await db.query(
      'UPDATE Operator SET FIO = $1, Telefon = $2, Login = $3, HPassword = $4, Email = $5 WHERE id = $6',
      [FIO, Telefon, Login, HPassword, Email, id]
    );
    res.json({ message: 'Оператор обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении оператора' });
  }
};

// Удалить оператора
exports.deleteOperator = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Operator WHERE id = $1', [id]);
    res.json({ message: 'Оператор удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении оператора' });
  }
}
