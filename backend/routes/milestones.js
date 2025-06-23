const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const milestoneController = require('../controllers/milestoneController');
const tipRoutes = require('./tips');

router.use('/:milestoneId/tips', tipRoutes);

router.get('/', auth, milestoneController.getMilestones);
router.get('/:id', auth, milestoneController.getMilestone);
router.post('/', auth, milestoneController.createMilestone);
router.put('/:id', auth, milestoneController.updateMilestone);
router.delete('/:id', auth, milestoneController.deleteMilestone);

module.exports = router; 