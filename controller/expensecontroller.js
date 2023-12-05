const path = require('path')

const jwt = require('jsonwebtoken')
const pvtkey = 'backendencryptstring'

const Expense = require('../model/expense')
const User = require('../model/user')


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
        const isprem = await user.getPremium()
        if(isprem){
            return res.status(200).json(isprem.status)
        }else{
            return res.status(200).json(false)
        }
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
        const isprem = await user.getPremium()
        if (!isprem) {
            const p = await user.createPremium({
                paymentid: req.body.pay_id,
                status: true
            })
            if (p) {
                return res.status(201).json({ message: 'You are a now a Premium Member' })
            } else {
                throw new Error
            }
        } else {
            return res.status(200).json({ message: 'You are already a Premium Member' })

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