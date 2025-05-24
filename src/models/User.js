const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET || 'supersecrettoken';

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Пользователь уже существует' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Неверные учетные данные' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Неверные учетные данные' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
