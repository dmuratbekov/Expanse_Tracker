const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionsController');

router.get('/', auth, getTransactions);
router.post('/', auth, createTransaction);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;