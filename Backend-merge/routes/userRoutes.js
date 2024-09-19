const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { getUsers ,createUser  , updateUser , deleteUser , getOneUser, updateAccessToken, getUser} = require("../controllers/userController.js");


router.post("/create-user",
	[
		check("email", "Please include a valid email").isEmail(),
	],
	createUser);
router.get("/all-users",getUsers);
router.get("/:id",getOneUser);
router.put("/update-user/:id",updateUser);
router.put("/update-token/:id", updateAccessToken)
router.delete("/delete-user/:id",deleteUser);
router.get("/get-user/:id", getUser)
router.delete("/delete-user/:id",deleteUser);


module.exports = router;
