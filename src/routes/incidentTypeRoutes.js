const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidentTypeController');

// Роуты для CRUD операций с типами инцидентов
router.get('/', controller.getAllIncidentTypes);
router.get('/:id', controller.getIncidentTypeById);
router.post('/', controller.createIncidentType);
router.put('/:id', controller.updateIncidentType);
router.delete('/:id', controller.deleteIncidentType);

module.exports = router;
