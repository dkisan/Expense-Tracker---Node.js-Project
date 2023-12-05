const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json())

const sequelize = require('./util/database')

const userroute = require('./routes/userroute')
const expenseroute = require('./routes/expenseroute')

const User = require('./model/user')
const Expense = require('./model/expense')

User.hasMany(Expense)
Expense.belongsTo(User)




app.use('/expense', expenseroute)
app.use('/', userroute)

// sequelize.sync({force:true})
sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
