const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    /* console.log("ID:", req.params.id);
    console.log("LISTING:", listing);
    console.log("REVIEW:", req.body.review); */
    newReview.author = req.user._id;
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();

    console.log("new review is added");
    req.flash("success","New review is added!!");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async(req,res) => {
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!!");
    res.redirect(`/listing/${id}`);
};