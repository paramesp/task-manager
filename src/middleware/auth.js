const User = require('../model/user');
const jwt=require('jsonwebtoken');

const auth =async function(req,res,next){
  try{
    const authCode=req.headers['authorization'];
    if (authCode){
        const token=authCode.replace('Bearer ','');
        const valid= jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({'tokens.token': token});
        if (valid && user) {
            req.token=token;
            req.user=user;
            next();
        }else{
            throw Error('Authenticate')
        }
    }else{
        throw Error('Authenticate')
    }    
}catch(e){
    res.status(404).send(e.message)
}
}

module.exports=auth;
