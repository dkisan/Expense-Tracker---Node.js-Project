const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const  Forgotpassword = sequelize.define('forgotpasswords',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
})

module.exports = Forgotpassword