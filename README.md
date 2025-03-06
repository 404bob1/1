# VIN Decoder Application

This repository contains a complete VIN Decoder application that connects to the NHTSA's Vehicle Product Information Catalog (vPIC) API to decode Vehicle Identification Numbers.

## Overview

The application consists of two main components:

1. **Frontend**: A web-based UI that allows users to input VINs and view detailed vehicle information
2. **Backend**: A Node.js server that acts as a proxy to the NHTSA API, resolving CORS issues

The application allows users to:
- Decode single VINs with optional model year specification
- Batch decode multiple VINs at once
- View detailed vehicle specifications
- Learn about VIN structure and its significance

## Setup Instructions

### Backend Setup

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)
2. Navigate to the backend directory:
   ```
   cd vin-decoder-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
   
The server will run on port 3000 by default (http://localhost:3000).

### Frontend Setup

1. Simply open the `index.html` file in your web browser, or serve it using any static file server.
2. In the "Backend API Configuration" section, enter the URL of your running backend server (default is `http://localhost:3000`).
3. Click "Save" to store this configuration.

## API Endpoints

The backend server provides the following endpoints:

### 1. Decode Single VIN
- **Endpoint:** `/api/decode/:vin`
- **Method:** GET
- **Parameters:**
  - `vin` (path parameter): The VIN to decode
  - `year` (query parameter, optional): Model year of the vehicle
- **Example:** `GET /api/decode/1FTEW1EP5MFA13791?year=2021`

### 2. Decode Batch VINs
- **Endpoint:** `/api/decodeBatch`
- **Method:** POST
- **Body:**
  ```json
  {
    "data": "1FTEW1EP5MFA13791,2021;5UXWX7C5*BA,2011;5YJSA3DS*EF,2015;"
  }
  ```
- **Format:** VIN,ModelYear;VIN,ModelYear; (ModelYear is optional)

### 3. Get All Makes
- **Endpoint:** `/api/makes`
- **Method:** GET
- **Example:** `GET /api/makes`

### 4. Get Models for a Make
- **Endpoint:** `/api/models/:make`
- **Method:** GET
- **Parameters:**
  - `make` (path parameter): The make name (e.g., "honda", "toyota")
- **Example:** `GET /api/models/honda`

## NHTSA API Reference

This application uses the following NHTSA vPIC API endpoints:
- Decode VIN Values Extended: `/vehicles/DecodeVinValuesExtended/:vin`
- Decode VIN Values Batch: `/vehicles/DecodeVINValuesBatch/`
- Get All Makes: `/vehicles/GetAllMakes`
- Get Models for Make: `/vehicles/GetModelsForMake/:make`

Full API documentation is available at [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/).

## Technical Details

### Frontend
- Built with vanilla JavaScript, HTML, and CSS
- Responsive design that works on mobile and desktop
- Tabbed interface for different functions
- Configurable backend URL

### Backend
- Node.js with Express.js
- Uses Axios for HTTP requests
- CORS enabled for cross-origin requests
- Error handling and response formatting

## License

MIT

## Acknowledgements

This application uses the NHTSA's vPIC API which provides vehicle specification data. The data is compiled from information submitted by vehicle manufacturers to the NHTSA.