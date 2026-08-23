const express = require("express");

const router = express.Router();

const docs_upload_middleware=require("../../middleware/upload_docs.middleware")

const docs_upload_controller=require("../../controller/upload_docs/upload_docs.controller")

const multerErrorMiddleware=require("../../middleware/handleMulterError.middleware")

router.post("/",docs_upload_middleware.documentUpload.single("file"),multerErrorMiddleware,docs_upload_controller.uploadDocument);

module.exports = router;  