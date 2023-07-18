// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "development"}` });

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const tripRoutes = require("./routes/trip.routes");
app.use("/api", tripRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const externalApiRoutes = require("./routes/external.routes");
app.use("/api", externalApiRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
