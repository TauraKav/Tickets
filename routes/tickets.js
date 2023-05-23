const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const {
    INSERT_TICKET,
    BUY_TICKET,
} = require("../controllers/tickets");


router.post("/ticket", INSERT_TICKET);
router.post("/buyTicket", authMiddleware, BUY_TICKET);

module.exports = router;