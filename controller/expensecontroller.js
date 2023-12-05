const path = require('path')

const jwt = require('jsonwebtoken')
const pvtkey = 'backendencryptstring'

const Expense = require('../model/expense')
const User = require('../model/user')

exports.getExpensePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/expenseform.html'))
}

exports.getExpenses = async (req, res, next) => {
    try {
        const uid = jwt.verify(req.params.usertoken, pvtkey, (err, decoded) => {
            if (err) throw new Error;
            return decoded
        })
        const user = await User.findOne({
            where: {
                id: uid
            }
        })
        const exp = await user.getExpenses()
        res.status(200).json(exp)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.postAddExpense = async (req, res, next) => {
    try {
        const uid = jwt.verify(req.body.uid, pvtkey, (err, decoded) => {
            if (err) throw new Error;
            return decoded
        })
        const user = await User.findOne({
            where: {
                id: uid
            }
        })
        const exp = await user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        })
        if (exp) {
            res.status(200).json({ message: 'Expense Added Successfully', id: exp.id })
        } else {
            res.status(500).json({ message: 'some error occured' })
        }
        console.log('hi')
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err)
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const uid = jwt.verify(req.body.uid, pvtkey, (err, decoded) => {
            if (err) throw new Error;
            return decoded
        })
        const user = await User.findOne({
            where: {
                id: uid
            }
        })
        const exp = await user.getExpenses({
            where: {
                id: req.body.id
            }
        })
        if (exp) {
            await Expense.destroy({
                where:{
                    id:exp[0].dataValues.id
                }
            })
            return res.status(200).json({ message: 'Expense Deleted Successfully' })
        }else{
            res.status(500).json({ message: 'Some Error occured' })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}