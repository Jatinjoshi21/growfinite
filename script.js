// Fetch user balance
async function fetchBalance() {
    try {
        const response = await fetch('https://your-api.com/balance?user=yourUserId');
        const data = await response.json();
        document.querySelector('.balance').innerText = 'Balance: $' + data.balance;
        balance = data.balance;
    } catch (error) {
        console.error("Error fetching balance:", error);
        document.querySelector('.balance').innerText = 'Balance: $0 (Error)';
    }
}
fetchBalance();

// Toggle menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}
document.getElementById('overlay').addEventListener('click', toggleMenu);

// Login system
async function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert("Please enter username and password.");
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
            localStorage.setItem("authToken", data.token);
            alert("Login successful!");
            window.location.href = "main.html"; // Redirect to main page
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}

// Sign-up function
async function signUpUser() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('https://your-api.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Sign-up successful! Please log in.");
            toggleForm(); // Switch to login form
        } else {
            alert(`Sign-up failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Sign-up error:", error);
        alert("An error occurred during sign-up.");
    }
}

// Toggle between login and sign-up forms
function toggleForm() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('signUpForm').classList.toggle('hidden');
}

// Generate public and private keys (for new users)
function generateKeys() {
    let publicKey = "0000";
    let privateKey = "0000";

    for (let i = 0; i < 31; i++) {
        publicKey += Math.floor(Math.random() * 10);
        privateKey += Math.floor(Math.random() * 10);
    }

    document.getElementById("randomNumber1").innerText = publicKey;
    document.getElementById("randomNumber2").innerText = privateKey;

    document.getElementById("publicKeyLabel").style.display = "block";
    document.getElementById("privateKeyLabel").style.display = "block";
    document.getElementById("Continue").style.display = "block";

    document.getElementById("randomNumber1").classList.add("show");
    document.getElementById("randomNumber2").classList.add("show");

    document.getElementById("generateBtn").disabled = true;
}

// Transfer funds
async function transferFunds() {
    const senderNumber = document.getElementById('senderNumber').value;
    const receiverNumber = document.getElementById('receiverNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const transactionPin = document.getElementById('transactionPin').value;
    const coin = document.getElementById('coin');
    const moneyFlow = document.getElementById('moneyFlow');

    if (!senderNumber || !receiverNumber || isNaN(amount) || !transactionPin) {
        alert("Please fill in all fields with valid numbers.");
        return;
    } else if (amount > balance) {
        alert("Insufficient balance.");
        return;
    }

    try {
        const response = await fetch('https://your-api.com/transfer', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                sender: senderNumber,
                receiver: receiverNumber,
                amount: amount,
                coin: coin ? coin.value : "USD",
                pin: transactionPin
            })
        });

        const data = await response.json();

        if (response.ok) {
            balance -= amount;
            document.querySelector('.balance').innerText = 'Balance: $' + balance;

            moneyFlow.innerHTML = `<span style="color: green;">Transaction Successful!</span>`;
            alert(`Transfer successful!\nTransaction ID: ${data.transactionId}`);
        } else {
            moneyFlow.innerHTML = `<span style="color: red;">Transaction Failed: ${data.message}</span>`;
            alert(`Transaction failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing the transaction.");
    }

    // Coin animation
    coin.style.display = 'block';
    coin.style.animation = 'none';
    void coin.offsetWidth;
    coin.style.animation = 'transferCoin 2s forwards';

    // SVG animation
    moneyFlow.style.display = 'block';
    moneyFlow.style.strokeDasharray = '0,200';
    void moneyFlow.offsetWidth;
    moneyFlow.style.animation = 'none'
    moneyFlow.style.animation = 'dash 2s linear forwards'

    const styleSheet = document.createElement("style")
    styleSheet.innerHTML = `@keyframes dash { to { stroke-dashoffset: 1000; } }`
    document.head.appendChild(styleSheet)

    setTimeout(() => {
        coin.style.display = 'none';
        styleSheet.remove();
        moneyFlow.style.animation = 'none';

        balance -= amount;
        document.querySelector('.balance').innerText = 'Balance: $' + balance;

        alert(`Transfer successful!\nFrom: ${senderNumber}\nTo: ${receiverNumber}\nAmount: $${amount}`);

    }, 2000);
}

// Cursor light effect
document.addEventListener("mousemove", (event) => {
    const cursorLight = document.getElementById("cursorLight");
    cursorLight.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});
