require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.Maxx_Energy_DB,
});

db.connect(err => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    }
});

// Register endpoint
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    
  // Generate a verification token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Insert user into database with unverified status
    const query = 'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)';
    db.query(query, [email, password, verificationToken], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

    // Verification email
    const verificationLink = `http://localhost:${process.env.PORT}/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error sending email' });
        }
        res.status(200).json({ message: 'Verification email sent' });
        });
    });
});

app.get('/verify', (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    const query = 'SELECT * FROM users WHERE verification_token = ?';
    db.query(query, [token], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Mark user as verified
        const updateQuery = 'UPDATE users SET verified = TRUE, verification_token = NULL WHERE verification_token = ?';
        db.query(updateQuery, [token], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.send('Email verified! You can now log in.');
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND verified = TRUE';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials or email not verified' });
        }

        res.status(200).json({ message: 'Login successful!' });
    });
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
