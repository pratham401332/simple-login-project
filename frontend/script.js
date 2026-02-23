async function sendData() {
    const idInput = document.getElementById('userId').value;
    const passInput = document.getElementById('password').value;
    const status = document.getElementById('status');

    status.innerText = "Sending data to cloud...";

    try {
        // This connects to the route we created in server.js
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: idInput,
                password: passInput
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            status.style.color = "green";
            status.innerText = result.message;
        } else {
            status.style.color = "red";
            status.innerText = "Error: " + result.error;
        }
    } catch (error) {
        status.style.color = "red";
        status.innerText = "Could not connect to server. Is it running?";
    }
}