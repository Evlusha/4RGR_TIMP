const express = require('express');
const router = express.Router();
const controller = require('../controllers/sensorStatusController');

router.get('/', controller.getAllStatuses);
router.post('/', controller.createStatus);
router.put('/:id', controller.updateStatus);
router.delete('/:id', controller.deleteStatus);

module.exports = router;
