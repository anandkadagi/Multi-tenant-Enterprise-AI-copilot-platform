const express = require("express");

const router = express.Router();

const sendQuery=require("../../controller/query/send_query.controller")

router.post("/send_query",sendQuery.send_query_controller);

module.exports = router;