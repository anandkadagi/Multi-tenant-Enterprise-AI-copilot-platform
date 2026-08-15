const express = require("express");

const router = express.Router();

const multer= require("multer")

const uploadUsers = require("../../controller/uploadUsers/upload_users.controller");

//File upload
const upload = multer({
  dest: "uploads/"
});

router.post("/bulk_register",upload.single("file"),uploadUsers.bulk_register);

module.exports = router;   