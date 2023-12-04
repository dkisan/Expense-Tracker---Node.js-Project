const Sequelize = require('sequelize')

const sequelize = new Sequelize('expensetracker_backend_dk','root','mysqlroot',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;
