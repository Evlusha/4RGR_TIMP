const express = require('express');

const router = express.Router();
const db = require('../config/db');
const controller = require('../controllers/operatorController');
const authMiddleware = require('../middlewares/authMiddleware'); // ⬅️ подключение

// ✅ Получение текущего профиля (по токену)
router.get('/profile', authMiddleware, controller.getCurrentProfile);

// CRUD для операторов
router.get('/', controller.getAllOperators);
router.get('/:id', controller.getOperatorById);
router.post('/', controller.createOperator);
router.put('/:id', controller.updateOperator);
router.delete('/:id', controller.deleteOperator);


// Получить оператора по ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT id, fio, email, telefon, login FROM operator WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Оператор не найден' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль
router.put('/:id', async (req, res) => {
  const { fio, email, telefon } = req.body;
  try {
    await db.query(
      'UPDATE operator SET fio = $1, email = $2, telefon = $3 WHERE id = $4',
      [fio, email, telefon, req.params.id]
    );
    res.json({ message: 'Профиль обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка обновления' });
  }
});

module.exports = router;


