const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    // URL se category
    const category = req.query.category;
    //URL se location
    const { searchLocation } = req.query;
    // Agar user ne search bar mein kuch type kiya hai
    if (searchLocation && searchLocation.trim() !== "") {
        allListings = await Listing.find({
            $or: [
                    {location: { $regex: searchLocation.trim(), $options: "i" }},
                    { country: { $regex: searchLocation, $options: "i" } }
                ]
        });
    }

    // Agar URL mein category hai, toh sirf wahi data dhoondo
    else if (category) {
        allListings = await Listing.find({ category: category });
    }
    // Agar koi category nahi hai (normal page load), toh sab dhoondo
    else {
        allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/form.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews" , populate:{path:"author"},}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!");
        return res.redirect("/listing");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res,next) => {
  /* console.log("BODY:", req.body); */
/*   console.log("BODY:", req.body);
  console.log("LISTING:", req.body?.listing); */
    /* if(!req.body?.listing){
    throw new ExpressError(400,"Send a valid data for listing");
  } */
    let response = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1
    })
    .send();
    /* console.log(response.body.features[0].geometry);
    res.send("done"); */


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let updatedListing = await newListing.save();
    console.log(updatedListing);
    req.flash("success","New listing Created!!");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!!");
        return res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;

    let editImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_400");
    /* // console.log(editImageUrl); */
    res.render("./listings/edit_form.ejs", { listing , editImageUrl});
};

module.exports.updateListing = async (req, res,next) => {
    let { id } = req.params;
    let response = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1
    })
    .send();
    let updatedListing = { ...req.body.listing };
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
    };
    updatedListing.geometry =response.body.features[0].geometry;
    await Listing.findByIdAndUpdate(id,updatedListing,);//{runValidators: true,} ko bhi findByIdAndUpdate(mai pass kar sakte hai to validate)
    req.flash("success","Listing updated successfully!!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!!");
    res.redirect("/listing");
};
