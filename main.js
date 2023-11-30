const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// Database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your database username
    password: 'REDACTED', // replace with your database password
    database: 'test_db' // replace with your database name
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database with thread ID: ' + connection.threadId);
});

// Basic CRUD routes
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    if (!req.body.FirstName || !req.body.LastName) {
        res.status(400).send('FirstName and LastName are required');
        return;
    }

    const newUser = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName
    };

    connection.query('INSERT INTO Users SET ?', newUser, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving data to database');
            return;
        }
        res.status(201).send(`User added with ID: ${results.insertId}`);
    });
});

// ... other CRUD operations ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
