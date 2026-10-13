if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const socialRouter = require("./routes/social.js");

/* const mongoUrl = "mongodb://127.0.0.1:27017/tripstay"; */
const dbUrl = process.env.ATLASDB_URL;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));



main()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRETE,
  },
  touchAfter:24*3600,
})

const sessionOptions = {
  store,
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly:true,
  },
};

app.get("/", async (req, res) => {
  res.redirect("/listing");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use("/social",socialRouter);

// Legal & Policy pages
app.get("/privacy", (req, res) => {
  res.render("legal/privacy.ejs");
});

app.get("/terms", (req, res) => {
  res.render("legal/terms.ejs");
});

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!!"));
});

app.use((err,req,res,next) =>{
    /* console.log("ERROR:", err);
    console.log("STATUS CODE:", err.statusCode);
    console.log("MESSAGE:", err.message); */

  let {statusCode = 500,message = "Something went wrong!!!"} = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
})

app.listen(8080, () => {
  console.log("server is listining to port 8080");
});
