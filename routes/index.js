const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/user_data.json');

// Route to save data (already implemented)
router.post('/save-data', (req, res) => {
    const newData = req.body;

    // Read the existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let existingData = [];
        if (data.trim()) {
            try {
                existingData = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing JSON data' });
            }
        }

        existingData.push(newData);

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing data file' });
            }
            res.json({ message: 'Data saved successfully' });
        });
    });
});

// Route to get data (already implemented)
router.get('/get-data', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data' });
        }

        let dataArray = [];
        if (data.trim()) {
            try {
                dataArray = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing JSON data' });
            }
        }

        res.json(dataArray);
    });
});

// Route to update data
router.put('/update-data/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Get the index from the URL parameter
    const updatedData = req.body;

    // Read the existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let existingData = [];
        if (data.trim()) {
            try {
                existingData = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing JSON data' });
            }
        }

        if (index >= 0 && index < existingData.length) {
            // Update the data at the given index
            existingData[index] = updatedData;

            // Write the updated data back to the file
            fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error writing data file' });
                }
                res.json({ message: 'Data updated successfully' });
            });
        } else {
            res.status(400).json({ error: 'Invalid index' });
        }
    });
});

// Route to delete data
router.delete('/delete-data/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Get the index from the URL parameter

    // Read the existing data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data file' });
        }

        let existingData = [];
        if (data.trim()) {
            try {
                existingData = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ error: 'Error parsing JSON data' });
            }
        }

        if (index >= 0 && index < existingData.length) {
            // Remove the data at the given index
            existingData.splice(index, 1);

            // Write the updated data back to the file
            fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error writing data file' });
                }
                res.json({ message: 'Data deleted successfully' });
            });
        } else {
            res.status(400).json({ error: 'Invalid index' });
        }
    });
});

module.exports = router;
