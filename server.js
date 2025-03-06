// server.js - Node.js backend for the VIN Decoder Application
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base URL for NHTSA API
const NHTSA_API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

// Route for single VIN decoding
app.get('/api/decode/:vin', async (req, res) => {
    try {
        const { vin } = req.params;
        const modelYear = req.query.year || '';
        
        let apiUrl = `${NHTSA_API_BASE_URL}/DecodeVinValuesExtended/${vin}?format=json`;
        
        if (modelYear) {
            apiUrl += `&modelyear=${modelYear}`;
        }
        
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.Results) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'No results found for this VIN' });
        }
    } catch (error) {
        console.error('Error decoding VIN:', error);
        res.status(500).json({ 
            error: 'Error connecting to NHTSA API',
            details: error.message 
        });
    }
});

// Route for batch VIN decoding
app.post('/api/decodeBatch', async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: 'No VIN data provided' });
        }
        
        const apiUrl = `${NHTSA_API_BASE_URL}/DecodeVINValuesBatch/`;
        
        const formData = new URLSearchParams();
        formData.append('data', data);
        formData.append('format', 'json');
        
        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (response.data && response.data.Results) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'No results found for the submitted VINs' });
        }
    } catch (error) {
        console.error('Error decoding batch VINs:', error);
        res.status(500).json({
            error: 'Error connecting to NHTSA API',
            details: error.message
        });
    }
});

// Route for getting all makes
app.get('/api/makes', async (req, res) => {
    try {
        const apiUrl = `${NHTSA_API_BASE_URL}/GetAllMakes?format=json`;
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.Results) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'No makes found' });
        }
    } catch (error) {
        console.error('Error getting all makes:', error);
        res.status(500).json({
            error: 'Error connecting to NHTSA API',
            details: error.message
        });
    }
});

// Route for getting models for a specific make
app.get('/api/models/:make', async (req, res) => {
    try {
        const { make } = req.params;
        const apiUrl = `${NHTSA_API_BASE_URL}/GetModelsForMake/${make}?format=json`;
        
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.Results) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'No models found for this make' });
        }
    } catch (error) {
        console.error('Error getting models for make:', error);
        res.status(500).json({
            error: 'Error connecting to NHTSA API',
            details: error.message
        });
    }
});

// Serve static files (if needed)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for testing purposes
module.exports = app;