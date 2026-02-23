require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json()); 
app.use(cors());         

// --- TiDB Cloud Connection Pool (Professional Way) ---
const pool = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT || 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE || 'login',
    waitForConnections: true,
    connectionLimit: 10, // Allows multiple people to login at once
    queueLimit: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Convert pool to use promises (makes error handling cleaner)
const db = pool.promise();

// --- Test Route (To check if Render is awake) ---
app.get('/',
