"use strict";

// Environment variables setup
const mongoDB = process.env.MYSQL_URI;
const sessionSecret = process.env.SESSION_SECRET;

// Mock database connection setup
const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Express.js replacements for routing, error handling, etc., are removed as we're moving to a client-side solution.

// Define an example function to interact with MySQL and handle user login
async function loginUser(username, password) {
  // Fetch API call to backend `/login` route
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    setSessionCookie("authToken", data.token, 1); // Save token if authenticated
    return true;
  } else {
    console.log("Login failed");
    return false;
  }
}

// Session management using client-side cookies
function setSessionCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getSessionCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Example function to fetch user data (replace MongoDB methods with SQL queries)
function getUserById(userId, callback) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      callback(err);
      return;
    }
    callback(null, results[0]);
  });
}

// Example of handling errors manually without http-errors
function handleError(message, status) {
  console.error("Error:", message);
  document.body.innerHTML = `<h1>${status} - ${message}</h1>`;
}

// Route simulations - typically these would be handled by a backend server
async function handleRouteChange() {
  const path = window.location.pathname;
  switch (path) {
    case "/":
      // Load home page
      document.body.innerHTML = "<h1>Home Page</h1>";
      break;
    case "/login":
      // Display login form and handle login logic
      document.body.innerHTML = `
        <h1>Login Page</h1>
        <form id="loginForm">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      `;

      document
        .getElementById("loginForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;
          const loginSuccess = await loginUser(username, password);
          if (loginSuccess) {
            navigateTo("/");
          } else {
            console.log("Invalid login credentials.");
          }
        });
      break;
    case "/profile":
      // Profile page, assuming the user is authenticated
      const authToken = getSessionCookie("authToken");
      if (!authToken) {
        navigateTo("/login");
        return;
      }
      // Fetch user data and render profile
      getUserById(authToken, (err, user) => {
        if (err) {
          handleError("Unable to fetch profile", 500);
        } else {
          document.body.innerHTML = `<h1>Welcome, ${user.username}</h1>`;
        }
      });
      break;
    default:
      handleError("Page not found", 404);
  }
}

// Routing without Express.js (simple client-side SPA navigation)
function navigateTo(route) {
  history.pushState({}, "", route);
  handleRouteChange();
}

// Initialize routing
window.addEventListener("popstate", handleRouteChange);
handleRouteChange();

// Export for use in other modules if needed
module.exports = {
  loginUser,
  getSessionCookie,
  setSessionCookie,
  getUserById,
  navigateTo,
};
