const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// Define ledger routes
router.get('/', ledgerController.getAllEntries);
router.post('/', ledgerController.addEntry);
router.get('/:id', ledgerController.getEntryById);
router.put('/:id', ledgerController.updateEntry);
router.delete('/:id', ledgerController.deleteEntry);
router.post('/import', ledgerController.importOfx);

module.exports = router;
