const express= require("express");
const validateToken = require("../middleware/validateToken")
const router = express.Router();
const {userRegister,userLogin} = require("../controllers/userController")
router.post("/register",userRegister);
router.post("/login",userLogin);

module.exports = router;