const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json())


const userroute = require('./routes/userroute')



app.post('/user/signup',(req,res,next)=>{
    console.log(req.body)
    console.log('signup form submitting')
})
app.use('/',userroute)

app.listen(3000);
