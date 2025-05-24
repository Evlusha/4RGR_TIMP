const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidentController');

router.get('/', controller.getAllIncidents);
router.get('/:id', controller.getIncidentById);
router.post('/', controller.createIncident);  // здесь включаем свет и шлём событие через socket.io
router.put('/:id', controller.updateIncident);
router.delete('/:id', controller.deleteIncident);

module.exports = router;
