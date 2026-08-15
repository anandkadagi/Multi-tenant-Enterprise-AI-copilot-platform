const express = require("express");

const router = express.Router();

const setPassword = require("../../controller/setPassword/set_password.controller");

router.post("/set_password",setPassword.set_password_controller);

module.exports = router;