// Toggle between Login and Signup Forms
function toggleForm() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('signUpForm').classList.toggle('hidden');
}

// Signup Function
async function signUp() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    // Generate Public & Private Keys
    let publicKey = "0000";
    let privateKey = "0000";
    for (let i = 0; i < 31; i++) {
        publicKey += Math.floor(Math.random() * 10);
        privateKey += Math.floor(Math.random() * 10);
    }

    try {
        const response = await fetch('https://your-api.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, publicKey, privateKey })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Signup successful!\nYour Public Key: ${publicKey}\nYour Private Key: ${privateKey}\nPlease save these keys securely.`);
            toggleForm(); // Switch back to login form
        } else {
            alert("Signup failed: " + data.message);
        }
    } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred. Try again.");
    }
}

// Login Function
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    try {
        const response = await fetch('https://your-api.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("publicKey", data.publicKey); // Store public key locally
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Try again.");
    }
}

// Fund Transfer Function
async function transferFunds() {
    const senderNumber = document.getElementById('senderNumber').value;
    const receiverNumber = document.getElementById('receiverNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!senderNumber || !receiverNumber || isNaN(amount)) {
        alert("Please fill in all fields with valid numbers.");
        return;
    }

    try {
        const response = await fetch('https://your-api.com/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderNumber, receiverNumber, amount })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Transfer successful!");
        } else {
            alert("Transfer failed: " + data.message);
        }
    } catch (error) {
        console.error("Transfer Error:", error);
        alert("An error occurred. Try again.");
    }
}
