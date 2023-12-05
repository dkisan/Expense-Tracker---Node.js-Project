const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const  premium = sequelize.define('premium',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    paymentid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports = premium