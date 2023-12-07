const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const  Downloadurl = sequelize.define('downloadurls',{
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
    url:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Downloadurl