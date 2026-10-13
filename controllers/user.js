const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) =>{
    res.render("../views/user/signup.ejs");
};

module.exports.signup = async(req,res,next) =>{
    try{
        let {username,email,password} = req.body
        const newUser = new User({username,email});
        let registerUser = await User.register(newUser,password);
       /*  // console.log(registerUser); */
        req.login(registerUser,(err) =>{
            if(err){
                return next();
            };
            req.flash("success","Welcome to Trip Stay!!");
            res.redirect("/listing");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("../views/user/login.ejs");
};

module.exports.login = async(req,res) =>{
    req.flash("success","Welcome to Trip Stay!!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) =>{
    req.logOut((err) =>{
        if(err){
            next();
        };
        req.flash("success","Your are logged out!!");
        res.redirect("/listing");
    });
};