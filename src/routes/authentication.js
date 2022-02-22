const express= require("express")
const router= express.Router();

const passport = require("passport");
const { isLoggedIn, isNotLoggedIn }= require("../lib/auth")

router.get("/user",(req,res)=>{
    res.json(req.user)
})

router.get("/userLogedIn",(req,res)=>{
    res.json(req.isAuthenticated())
})

router.post("/signin",isNotLoggedIn,(req,res, next)=>{
    passport.authenticate("local.signin",{
        successRedirect: "operationslist.html"
    })(req,res,next);
})

router.post("/signup",isNotLoggedIn, passport.authenticate("local.signup",{
        successRedirect: "operationslist.html",
    }))

router.get("/logout", isLoggedIn, (req,res)=>{
    req.logOut();
    res.redirect("signin.html")
})


module.exports=router;