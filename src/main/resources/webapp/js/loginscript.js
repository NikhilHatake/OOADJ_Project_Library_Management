document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            if (response.ok) {
                // Login successful
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "index.html"; // Redirect to library page
            } else {
                document.getElementById("response").textContent = "Login failed!";
            }
        })
        .catch((error) => console.error("Error:", error));
});