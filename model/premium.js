const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const  premium = sequelize.define('premium',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    orderId:{
        type: Sequelize.STRING,
        allowNull: false
    },
    paymentid:{
        type:Sequelize.STRING,
        allowNull:false,
        defalultValue:'nill'
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = premium