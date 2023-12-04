const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json())

const sequelize = require('./util/database')

const userroute = require('./routes/userroute')
const expenseroute = require('./routes/expenseroute')




app.use('/expense', expenseroute)
app.use('/', userroute)

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
