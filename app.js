const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

dotenv.config()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(cors())
app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://checkout.razorpay.com;"
    );
    next();
  });
const sequelize = require('./util/database')

const userroute = require('./routes/userroute')
const expenseroute = require('./routes/expenseroute')

const User = require('./model/user')
const Expense = require('./model/expense')
const Premium = require('./model/premium');
const Forgotpassword = require('./model/forgetpassword');
const Downloadurl = require('./model/downloadurl');

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasOne(Premium)
Premium.belongsTo(User)

User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User)

User.hasMany(Downloadurl)
Downloadurl.belongsTo(User)


app.use('/expense', expenseroute)
app.use('/', userroute)

// sequelize.sync({force:true})
sequelize.sync()
    .then(() => {
        console.log('server started')
        app.listen(3000);
    })
