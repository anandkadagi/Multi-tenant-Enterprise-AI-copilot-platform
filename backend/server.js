require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

require("./jobs/DeleteConversation.job")

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});