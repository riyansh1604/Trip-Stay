require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({accessToken: process.env.MAP_TOKEN});
/* 
const mongoUrl = "mongodb://127.0.0.1:27017/tripstay"; */
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

const initDB =async () =>{
    await Listing.deleteMany({});
    for (let obj of initData.data) {
        const response = await geocodingClient.forwardGeocode({
            query: `${obj.location}, ${obj.country}`,
            limit: 1
        }).send();

        obj.geometry = response.body.features[0]?.geometry;
        obj.owner = "6ace3aac4f1835a65b22c6eb";
    };
    // initData.data = initData.data.map((obj) => ({...obj,owner:'6ac666884f1986c458fa9af3',}));
    
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();