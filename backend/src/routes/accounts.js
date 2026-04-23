const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
} = require('../controllers/accountsController');

router.get('/', auth, getAccounts);
router.post('/', auth, createAccount);
router.put('/:id', auth, updateAccount);
router.delete('/:id', auth, deleteAccount);

module.exports = router;