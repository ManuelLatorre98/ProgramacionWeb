module.exports={
   isLoggedIn(req, res, next){
       if (req.isAuthenticated()) {
            return next();
       }else{
           return res.redirect("signin.html")
       }
   }, 

   isNotLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return res.redirect("operationslist.html")
    }else{
       return next()
   }
   }
}