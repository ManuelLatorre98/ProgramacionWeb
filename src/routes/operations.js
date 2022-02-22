const {Router}= require("express");
const router= Router();
const poolDb= require("../database")
const { isLoggedIn }= require("../lib/auth")

router.post("/add", isLoggedIn,async (req,res)=>{
    const { concept, amount,date, type} =req.body;
    const newOperation={
        concept,
        amount,
        type,
        date,
        user_id: req.user.id
    }
    if(concept!="" && !isNaN(parseInt(amount)) && (new Date(date)!="Invalid Date") && type=="Entry" || type=="Egress"){
        await poolDb.query("INSERT INTO operations set ?", [newOperation]);//Await to save the operation
        res.location("http://localhost:3000/operationslist.html")
        res.sendStatus(201)
    }else{
        res.sendStatus(400)
    }
    
})

router.get("/", isLoggedIn, async (req,res)=>{
    let operations
    if(req.query.amount>=0){
        if(req.query.type=="all"){
            operations= await poolDb.query("SELECT * FROM operations WHERE user_id = ? ORDER BY id DESC LIMIT "+req.query.amount, [req.user.id])
        }else if(req.query.type=="entry"){
            operations= await poolDb.query("SELECT * FROM operations WHERE user_id = ? AND type = ? ORDER BY id DESC LIMIT "+req.query.amount, [req.user.id, "Entry"])
            console.log("entry")
        }else if(req.query.type=="egress"){
            operations= await poolDb.query("SELECT * FROM operations WHERE user_id = ? AND type = ? ORDER BY id DESC LIMIT "+req.query.amount, [req.user.id, "Egress"])
            console.log("egress")
        }
    }
    
    res.json(operations)
})

router.delete("/delete/:id", isLoggedIn,async (req,res)=>{
    const { id } = req.params;
    if(!isNaN(parseInt(id)) && parseInt(id)>=0){
        await poolDb.query("DELETE FROM operations WHERE ID = ?",[ id ]);
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
})

router.get("/edit/:id", isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    if(!isNaN(parseInt(id)) && parseInt(id)>=0){
        const operation = await poolDb.query("SELECT * FROM operations WHERE ID = ?", [ id ]);
        res.json(operation)
    }else{
        res.sendStatus(400)
    }
})


router.post("/edit/:id", isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    const { concept, amount, date } = req.body;
    const editedOperation = {
        concept,
        amount,
        date
    }
    if(!isNaN(parseInt(id)) && parseInt(id)>=0 && concept!="" && !isNaN(parseInt(amount)) && (new Date(date)!="Invalid Date")){
        await poolDb.query("UPDATE operations SET ? WHERE ID = ?",[ editedOperation, id ]);
        res.location("http://localhost:3000/operationslist.html")
        res.sendStatus(201)
    }else{
        res.sendStatus(400)
    }
})

router.get("/totalBalance", isLoggedIn, async (req,res)=>{    
    const operation= await poolDb.query("SELECT SUM(amount) AS finalBalance FROM operations")
    console.log(operation)
    res.json(operation)
})
module.exports=router
