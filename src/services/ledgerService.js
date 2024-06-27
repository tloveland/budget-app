let ledgerEntries = [];  // This will be replaced with database logic

function parseOfxDate(ofxDate) {
    // Assuming OFX date format is YYYYMMDDHHMMSS
    const year = ofxDate.substring(0, 4);
    const month = ofxDate.substring(4, 6);
    const day = ofxDate.substring(6, 8);
    return new Date(`${year}-${month}-${day}`);
}

exports.getAllEntries = async ({ page, year, month, sortField, sortDirection }) => {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let filteredEntries = ledgerEntries;

    if (year && month) {
        filteredEntries = filteredEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getFullYear() === parseInt(year) && (entryDate.getMonth() + 1) === parseInt(month);
        });
    }

    filteredEntries.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
        } else {
            return a[sortField] < b[sortField] ? 1 : -1;
        }
    });

    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

    return {
        transactions: paginatedEntries,
        currentPage: page,
        totalPages: Math.ceil(filteredEntries.length / itemsPerPage)
    };
};

exports.addEntry = async (entry) => {
    entry.id = ledgerEntries.length + 1;
    ledgerEntries.push(entry);
    return entry;
};

exports.getEntryById = async (id) => {
    return ledgerEntries.find(entry => entry.id === parseInt(id));
};

exports.updateEntry = async (id, updatedEntry) => {
    const index = ledgerEntries.findIndex(entry => entry.id === parseInt(id));
    if (index !== -1) {
        ledgerEntries[index] = { ...ledgerEntries[index], ...updatedEntry };
        return ledgerEntries[index];
    }
    return null;
};

exports.deleteEntry = async (id) => {
    const index = ledgerEntries.findIndex(entry => entry.id === parseInt(id));
    if (index !== -1) {
        ledgerEntries.splice(index, 1);
        return true;
    }
    return false;
};

exports.importOfxData = async (ofxParsed) => {
    const transactions = ofxParsed.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
    transactions.forEach(tx => {
        const entry = {
            id: ledgerEntries.length + 1,
            date: parseOfxDate(tx.DTPOSTED),
            description: tx.NAME,
            category: '',  // Set default category to empty
            memo: tx.MEMO,
            amount: tx.TRNAMT,
            cleared: true  // Assuming all imported transactions are cleared
        };
        ledgerEntries.push(entry);
    });
};
