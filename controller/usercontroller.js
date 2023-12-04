const path = require('path')

exports.gethome = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','/signup.html'))
}