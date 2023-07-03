const express = require("express");
const router = express.Router({mergeParams: true});
const {verifyUser, verifyOnlyUser, verifyAdmin} = require("../middleware/auth");
const {addReservation, getReservations, cancelReservation, checkUserCriteria} = require("../controllers/reservationsController");

router.post("/booking/checkUserCriteria", checkUserCriteria)
router.post("/", verifyOnlyUser, addReservation);
router.post("/:userId", verifyAdmin, addReservation);
router.get("/", verifyOnlyUser, getReservations);
router.get("/:userId", verifyAdmin, getReservations);
router.put("/:reservationId", verifyUser, cancelReservation);
module.exports = router;    