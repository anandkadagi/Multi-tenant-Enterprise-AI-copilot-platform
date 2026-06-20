const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const uploadUsersRoutes= require("./routes/uploadUsers/upload_users.routes");

const setPasswordRoutes= require("./routes/setPassword/set_password.routes");

const rbacMiddleware= require("./middleware/rbac.middleware");

const authenticate= require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/upload", authenticate, rbacMiddleware("TENANT_ADMIN"), uploadUsersRoutes);

app.use("/api/setPassword",authenticate, rbacMiddleware("User"), setPasswordRoutes);

module.exports = app;