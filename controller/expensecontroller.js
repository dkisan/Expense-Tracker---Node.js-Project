const path = require('path')

const jwt = require('jsonwebtoken')
const pvtkey = 'backendencryptstring'

const Expense = require('../model/expense')
const User = require('../model/user')

const Razorpay = require('razorpay')
const sequelize = require('../util/database')


exports.getExpensePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/expenseform.html'))
}
exports.ispremium = async (req, res, next) => {
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
        return res.status(200).json(user.ispremium)

    } catch (err) {
        return res.status(500).json(err)
    }

}
exports.purchaseorder = async (req, res, next) => {
    var instance = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret
    })

    var options = {
        amount: 250,
        currency: "INR",
        receipt: "Oid1"
    }

    try {
        instance.orders.create(options, async (err, order) => {
            if (order) {
                const uid = jwt.verify(req.body.uid, pvtkey, (err, decoded) => {
                    return decoded
                })
                const user = await User.findOne({
                    where: {
                        id: uid
                    }
                })
                const result = await user.createPremium({
                    orderId: order.id,
                    paymentid: 'nill',
                    status: order.status
                })
                return res.status(200).json({ order })
            }
        })
    } catch (err) {
        console.log(err.message)
    }
}

exports.failedpurchase = async (req, res, next) => {
    console.log(req.body)
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
        const prem = await user.getPremium({
            where: {
                orderId: req.body.order_id
            }
        })
        const p = await prem.update({
            status: 'failed'
        })
    } catch (err) {
        return res.status(500).json(err)
    }

}


exports.purchasepremium = async (req, res, next) => {
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
        const prem = await user.getPremium({
            where: {
                orderId: req.body.order_id
            }
        })
        const p = await prem.update({
            status: 'success',
            paymentid: req.body.pay_id
        })
        if (p) {
            await user.update({
                ispremium: true
            })
            return res.status(201).json({ message: 'You are a now a Premium Member' })
        }
    } catch (err) {
        return res.status(500).json(err)
    }

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
        return res.status(200).json(exp)
    } catch (err) {
        return res.status(500).json(err)
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
            return res.status(200).json({ message: 'Expense Added Successfully', id: exp.id })
        } else {
            return res.status(500).json({ message: 'some error occured' })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json(err)
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
                where: {
                    id: exp[0].dataValues.id
                }
            })
            return res.status(200).json({ message: 'Expense Deleted Successfully' })
        } else {
            return res.status(500).json({ message: 'Some Error occured' })
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getLeaderboard = async (req, res, next) => {
    const t = await Expense.findAll({
        include:[{
            model:User,
            attributes:['name']
        }],
        attributes: [
            [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ],
        group: ['userId'],
        order: [['total', 'DESC']]
    })
    return res.json(t)
}
