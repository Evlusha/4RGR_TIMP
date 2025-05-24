const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Регистрация
exports.register = async (req, res) => {
  const { FIO, Telefon, Login, Password, Email } = req.body;

  if (!FIO || !Telefon || !Login || !Password || !Email) {
    return res.status(400).json({ message: 'Все поля обязательны.' });
  }

  try {
    const { rows: existing } = await db.query('SELECT * FROM Operator WHERE Login = $1', [Login]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Логин уже занят.' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const { rows: idRow } = await db.query('SELECT MAX(ID) as maxid FROM Operator');
    const newId = (idRow[0].maxid || 0) + 1;

    await db.query(
      'INSERT INTO Operator (ID, FIO, Telefon, Login, HPassword, Email) VALUES ($1, $2, $3, $4, $5, $6)',
      [newId, FIO, Telefon, Login, hashedPassword, Email]
    );

    return res.status(201).json({ message: 'Оператор успешно зарегистрирован.' });
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    return res.status(500).json({ message: 'Ошибка сервера при регистрации.' });
  }
};

// Вход
exports.login = async (req, res) => {
  const { Login, Password } = req.body;

  if (!Login || !Password) {
    return res.status(400).json({ message: 'Логин и пароль обязательны.' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM Operator WHERE Login = $1', [Login]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль.' });
    }

    const isMatch = await bcrypt.compare(Password, user.hpassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный логин или пароль.' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        id: user.id,
        fio: user.fio,
        login: user.login,
        email: user.email,
        telefon: user.telefon
      },
      message: 'Успешный вход.'
    });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    return res.status(500).json({ message: 'Ошибка сервера при входе.' });
  }
};

// Профиль
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query('SELECT id, fio, telefon, login, email FROM Operator WHERE id = $1', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    return res.status(500).json({ message: 'Ошибка сервера при получении профиля.' });
  }
};
