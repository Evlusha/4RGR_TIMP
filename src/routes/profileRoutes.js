// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

module.exports = router;
