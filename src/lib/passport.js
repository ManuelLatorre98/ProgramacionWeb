const { Passport } = require("passport");
const passport= require("passport");
const poolDb = require("../database");
const LocalStrategy = require("passport-local").Strategy;
const helpers = require("../lib/helpers")

passport.use("local.signin", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async(req, email, password, done)=>{
    const result = await poolDb.query("SELECT * FROM users WHERE email = ?",[email]);
    if(result.length >0){
        const user= result[0];
        const validPassword=await helpers.matchPassword(password, user.password)
        if(validPassword){
            done(null, user)
        }else{
            done(null, false)
        }
    }else{
        return done(null, false)
    }
}))

passport.use("local.signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, async(req, email,password, done)=>{
    const newUser={
        email,
        password
    }
    const checkEmail = await poolDb.query("SELECT * FROM users WHERE email = ?",[email]);
    console.log("EEEEEO "+checkEmail.length)
    if(checkEmail.length===0){
        newUser.password = await helpers.encryptPassword(password)
        const result= await poolDb.query("INSERT INTO users SET ?", [newUser])
        newUser.id= result.insertId;
        done(null,newUser)
    }else{
        done(null,false)
    }
    
}));

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async (id, done)=>{
    const users = await poolDb.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, users[0])
})