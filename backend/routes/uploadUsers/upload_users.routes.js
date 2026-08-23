const express = require("express");

const router = express.Router();

const multer= require("multer")

const uploadUsers = require("../../controller/uploadUsers/upload_users.controller");

const user_upload_middleware=require("../../middleware/upload_docs.middleware")

const multerErrorMiddleware=require("../../middleware/handleMulterError.middleware")


router.post("/bulk_register",user_upload_middleware.excelUpload.single("file"),multerErrorMiddleware,uploadUsers.bulk_register);

module.exports = router;   