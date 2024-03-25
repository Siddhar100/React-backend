var jwt = require('jsonwebtoken');
const JWT_SECRET = "Siddhartha";

const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(400).send({error:"401"});
    }
    try{
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();    
    }catch(error){
        res.send("401");
    }
   
}


module.exports = fetchuser;