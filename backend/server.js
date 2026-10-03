require("dotenv").config();
console.log("DEBUG raw env:", process.env.DATABASE_URL);

const app = require("./app");

const PORT = process.env.PORT || 5000;

require("./jobs/DeleteConversation.job")

require("./jobs/expireSubscriptions.job")

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});