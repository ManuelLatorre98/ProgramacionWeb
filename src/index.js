const express= require("express")
const morgan = require("morgan")
const path = require("path")
const session = require("express-session")
const mySQLStore= require("express-mysql-session")
const passport = require("passport") 
const {database}=require("./keysDb")

//Initializations
const app= express()
require("./lib/passport")


//Settings
app.set("port", process.env.PORT || 3000)
app.set("views",path.join(__dirname, "views" ))//sets direction of directory views to "views"

//middlewares
app.use(session({
    secret:"myNodeSession",
    resave: false,
    saveUninitialized: false,
    store: new mySQLStore(database)
}))

app.use(morgan("dev"))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())


//Global Variables
app.use((req,res,next)=>{
    app.locals.user= req.user;
    next();
})


//routes
console.log(""+path.join(__dirname,"public/img/"))
app.use(express.static("src"))
app.use(express.static("src/public/js/"))
app.use(express.static("src/public/js/operations"))
app.use(express.static("src/public/js/partials"))
app.use(express.static("src/public/js/authentication"))
app.use(express.static("src/public/html/"))
app.use(express.static("src/public/html/authentication"))
app.use(express.static("src/public/html/operations"))
app.use(express.static("src/public/html/partials"))
app.use("/operations",require("./routes/operations"))
app.use(require("./routes/authentication"))

//Starting the server
app.listen(app.get("port"),()=>{
    console.log(`server on port ${app.get("port")}`)
})