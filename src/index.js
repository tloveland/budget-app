const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(fileUpload());

// Test Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Ledger Page Route
app.get('/ledger', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'ledger.html'));
});

// Routes
const ledgerRoutes = require('./routes/ledgerRoutes');
app.use('/api/ledger', ledgerRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
