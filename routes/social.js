const express = require("express");
const router = express.Router();

// Instagram page
router.get("/instagram", (req, res) => {
    res.render("social/instagram.ejs");
});

// Facebook page
router.get("/facebook", (req, res) => {
    res.render("social/facebook.ejs");
});

// Twitter/X page
router.get("/twitter", (req, res) => {
    res.render("social/twitter.ejs");
});

module.exports = router;
