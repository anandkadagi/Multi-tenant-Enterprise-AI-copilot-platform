const express = require("express");

const multer=require("multer")

const router = express.Router();

const auth = require("../controller/auth.controller");

router.post("/register_company",auth.register_company)

router.post("/register", auth.register);

router.post("/login", auth.login);

//File upload
const upload = multer({
  dest: "uploads/"
});

router.post("/bulk_register",upload.single("file"),auth.bulk_register)

router.post("/set_password",auth.set_password_controller)

module.exports = router;