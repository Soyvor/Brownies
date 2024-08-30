const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const filePath = 'student_data.xlsx';

// Serve the index.html file on the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', (req, res) => {
    const { name, prn, year, branch } = req.body;

    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        workbook = xlsx.utils.book_new();
    }

    let worksheet = workbook.Sheets['Students'];
    if (!worksheet) {
        worksheet = xlsx.utils.aoa_to_sheet([['Name', 'PRN', 'Year of Study', 'Branch']]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');
    }

    // Convert worksheet to JSON to check existing PRNs
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    const existingPRN = jsonData.find(row => row.PRN === prn);

    if (existingPRN) {
        return res.status(400).json({ success: false, message: "Already filled" });
    }

    const newRow = [[name, prn, year, branch]];
    xlsx.utils.sheet_add_aoa(worksheet, newRow, { origin: -1 });

    xlsx.writeFile(workbook, filePath);

    res.json({ success: true, message: "Data saved successfully! You have earned 5 brownie points! 🍪" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
