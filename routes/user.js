const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const {
  INSERT_USER,
  LOGIN,
  NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID, 
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_WITH_TICKETS_BY_ID,
} = require("../controllers/user");

router.post("/signUp", INSERT_USER);
router.post("/logIn", LOGIN);
router.post("/newJwtToken", NEW_JWT_TOKEN);
router.get("/allUsers", authMiddleware, GET_ALL_USERS);
router.get("/user/:id", authMiddleware, GET_USER_BY_ID);
// router.get("/allUsersWithTickets", authMiddleware, GET_ALL_USERS_WITH_TICKETS);
// router.get("/allUserWithTickets/:id", authMiddleware, GET_USER_WITH_TICKETS_BY_ID);

module.exports = router;

