require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json()); // Parses incoming JSON data
app.use(cors());         // Allows your frontend to communicate with the server

// --- TiDB Cloud Connection ---
const connection = mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT || 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE || 'login',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Test the connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to TiDB:', err.stack);
        return;
    }
    console.log('Successfully connected to TiDB Cloud!');
});

// --- API Route: Push Data (Signup/Login Entry) ---
app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    // The SQL query to "Push" data to your table
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    connection.query(sql, [userId, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to save data" });
        }
        
        console.log("Data inserted for user:", userId);
        res.json({ 
            message: "Success! Data pushed to TiDB Cloud.",
            insertedId: result.insertId 
        });
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});