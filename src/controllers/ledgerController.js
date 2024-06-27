const ledgerService = require('../services/ledgerService');
const ofxParser = require('ofx-js'); // You might need to install this package

exports.getAllEntries = async (req, res) => {
    try {
        const { page = 1, year, month, sortField = 'date', sortDirection = 'asc' } = req.query;
        const entries = await ledgerService.getAllEntries({ page, year, month, sortField, sortDirection });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addEntry = async (req, res) => {
    try {
        const entry = await ledgerService.addEntry(req.body);
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEntryById = async (req, res) => {
    try {
        const entry = await ledgerService.getEntryById(req.params.id);
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const entry = await ledgerService.updateEntry(req.params.id, req.body);
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const result = await ledgerService.deleteEntry(req.params.id);
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.importOfx = async (req, res) => {
    try {
        if (!req.files || !req.files['ofx-file']) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const ofxFile = req.files['ofx-file'];
        const ofxData = ofxFile.data.toString();
        const ofxParsed = await ofxParser.parse(ofxData);

        await ledgerService.importOfxData(ofxParsed);

        res.status(200).json({ message: 'OFX file imported successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
