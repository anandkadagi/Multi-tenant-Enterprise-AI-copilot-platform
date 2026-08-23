const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");

const uploadUsersRoutes= require("./routes/uploadUsers/upload_users.routes");

const setPasswordRoutes= require("./routes/setPassword/set_password.routes");

const queryRoutes=require("./routes/query/query.routes")

const rbacMiddleware= require("./middleware/rbac.middleware");

const authenticate= require("./middleware/auth.middleware");

const conversationRoutes=require("./routes/conversation_history/conversation.routes")

const uploadDocsRoutes=require("./routes/upload_docs/upload_docs.routes")

const listDocs=require("./routes/list_documents/listDocuments.routes")

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/upload", authenticate, rbacMiddleware("TENANT_ADMIN"), uploadUsersRoutes);

app.use("/api/uploadDocs", authenticate, rbacMiddleware("TENANT_ADMIN"), uploadDocsRoutes);

app.use("/api/listDocs",authenticate, rbacMiddleware("TENANT_ADMIN"), listDocs)

app.use("/api/setPassword",authenticate, rbacMiddleware("User"), setPasswordRoutes);

app.use("/api/query",authenticate,rbacMiddleware("SUPER_ADMIN","TENANT_ADMIN","User"), queryRoutes);

app.use("/api/conversation", authenticate,rbacMiddleware("SUPER_ADMIN","TENANT_ADMIN","User"), conversationRoutes);

module.exports = app;