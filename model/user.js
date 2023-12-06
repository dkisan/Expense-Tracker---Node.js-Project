const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const  user = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremium:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    totalexpense:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})

module.exports = user