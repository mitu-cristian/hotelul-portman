const express = require("express");
const router = express.Router();
const {verifyAdmin, verifyUser} = require("../middleware/auth")
const {createRoom, getSingleRoom, getAllRooms, updateRoom,
    deleteRoom, updateRoomAvailabilityAdd, updateRoomAvailabilityDelete} = require("../controllers/roomsController");
const reservationsRoutes = require("./reservationsRoutes");

router.use("/:roomId/reservations", reservationsRoutes);
router.use("/:roomId/reservations/:userId", reservationsRoutes)

router.route("/")
    .get(getAllRooms)
    .post(verifyAdmin, createRoom);

router.route("/:id")
    .get(getSingleRoom)
    .put(verifyAdmin, updateRoom)
    .delete(verifyAdmin, deleteRoom)

router.route("/availability/:id")
    .put(verifyUser, updateRoomAvailabilityAdd)
    .delete(verifyUser, updateRoomAvailabilityDelete)

module.exports = router;