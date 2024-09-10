const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend URL
    credentials: true, // Allow cookies
  })
);

// Session configuration
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 600000 }, // Session expires in 10 minutes
  })
);

// Static credentials for a single user
const user = {
  username: "admin",
  password: bcrypt.hashSync("password", 10), // Hash password for security
};

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate the static user credentials
  if (
    username === user.username &&
    bcrypt.compareSync(password, user.password)
  ) {
    req.session.userId = user.username; // Save the session
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Invalid username or password" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ message: "Logged out successfully" });
});

// Check if the user is authenticated
app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.send({ authenticated: true });
  } else {
    res.send({ authenticated: false });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
