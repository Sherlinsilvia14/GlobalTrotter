const API_URL = 'http://localhost:5000/auth';

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    // Basic Validation
    if (password !== confirmPassword) {
        message.style.color = 'red';
        message.textContent = "Passwords do not match!";
        message.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = 'green';
            message.textContent = "Signup successful! Redirecting to login...";
            message.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            message.style.color = 'red';
            message.textContent = data.msg || "Signup failed";
            message.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        message.style.color = 'red';
        message.textContent = "Server error. Please try again later.";
        message.style.display = 'block';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            message.style.color = 'green';
            message.textContent = "Login successful!";
            message.style.display = 'block';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            message.style.color = 'red';
            message.textContent = data.msg || "Invalid credentials";
            message.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        message.style.color = 'red';
        message.textContent = "Server error. Please try again later.";
        message.style.display = 'block';
    }
}
