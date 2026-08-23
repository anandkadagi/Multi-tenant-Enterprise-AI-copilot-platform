const express = require("express");

const router = express.Router();

const listDocument_controller=require("../../controller/upload_docs/upload_docs.controller")

router.get("/",listDocument_controller.listDocuments);

module.exports = router;  