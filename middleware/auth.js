const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
   
    const token = req.header('x-auth-token');
    try{
        const decoded = jwt.verify(token,config.get('privateKey'))
        req.user = decoded;
        next();
    }
    catch(ex){
        return res.status(403).send('invalid token');
    }

}