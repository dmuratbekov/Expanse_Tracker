const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getSummary,
    getByCategory,
    getByMonth,
} = require('../controllers/analyticsController');

router.get('/summary', auth, getSummary);
router.get('/by-category', auth, getByCategory);
router.get('/by-month', auth, getByMonth);

module.exports = router;