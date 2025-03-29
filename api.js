const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy database (Replace with actual DB)
const users = {};  
const balances = {};  

// Signup API
app.post('/signup', (req, res) => {
    const { username, password, publicKey, privateKey } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users[username]) {
        return res.status(400).json({ message: "User already exists." });
    }

    users[username] = { password, publicKey, privateKey };
    balances[publicKey] = 1000;  // Assign default balance

    res.json({ message: "Signup successful!", publicKey });
});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    res.json({ message: "Login successful!", publicKey: users[username].publicKey });
});

// Fund Transfer API
app.post('/transfer', (req, res) => {
    const { senderNumber, receiverNumber, amount } = req.body;

    if (!balances[senderNumber] || !balances[receiverNumber]) {
        return res.status(400).json({ message: "Invalid sender or receiver." });
    }

    if (balances[senderNumber] < amount) {
        return res.status(400).json({ message: "Insufficient balance." });
    }

    balances[senderNumber] -= amount;
    balances[receiverNumber] += amount;

    res.json({ message: "Transfer successful!", senderBalance: balances[senderNumber] });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
