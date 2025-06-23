const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const tipController = require('../controllers/tipController');

router.get('/', tipController.getTips); // public: anyone can view tips
router.post('/', auth, tipController.addTip); // only logged in users can add tips

module.exports = router; 