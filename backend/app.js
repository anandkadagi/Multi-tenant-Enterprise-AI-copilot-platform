const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const uploadUsersRoutes= require("./routes/uploadUsers/upload_users.routes");

const setPasswordRoutes= require("./routes/setPassword/set_password.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/upload",uploadUsersRoutes);

app.use("/api/setPassword",setPasswordRoutes);

module.exports = app;