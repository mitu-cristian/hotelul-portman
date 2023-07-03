const express = require("express");
const {addReview, getMyReview, updateMyReview, deleteMyReview, getUserReview, 
    deleteUserReview, getAllReviews, getAverageRating, reviewCheck} = require("../controllers/reviewsController");
const {verifyOnlyUser, oneReviewUser, verifyAdmin, verifyUser} = require("../middleware/auth");
const router = express.Router();

router.get("/all", getAllReviews);
router.get("/average", getAverageRating);
router.get("/check", verifyUser, reviewCheck);

router.route("/")
    .get(verifyOnlyUser, getMyReview)
    .post(verifyOnlyUser, oneReviewUser, addReview)
    .put(verifyOnlyUser, updateMyReview)
    .delete(verifyOnlyUser, deleteMyReview)

router.route("/:userId")
    .get(verifyAdmin, getUserReview)
    .delete(verifyAdmin, deleteUserReview)

module.exports = router;