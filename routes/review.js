const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//post request
router.post("/",isLoggedIn,validateReview, reviewController.createReview);

//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, reviewController.destroyReview);

module.exports = router;
