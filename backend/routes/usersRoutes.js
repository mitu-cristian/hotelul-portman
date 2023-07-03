const express = require("express");
const router = express.Router();
const {verifyUser, verifyOnlyUser, verifyAdmin} = require ("../middleware/auth");
const {registerUser, loginUser, loginAdmin, logoutUser, updateMyUserDetails, 
    getMe, deleteMe, updateMyPassword, getAnUser, deleteAnUser, getAllUsers} = require("../controllers/usersController")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
router.get("/logout", logoutUser);
router.put("/updatePassword", verifyUser, updateMyPassword);

router.get("/all", verifyAdmin, getAllUsers);

router.route("/:userId")
    .get(verifyAdmin, getAnUser)
    .delete(verifyAdmin, deleteAnUser)

router.route("/")
    .put(verifyOnlyUser, updateMyUserDetails)
    .get(verifyUser, getMe)
    .delete(verifyUser, deleteMe)

module.exports = router;