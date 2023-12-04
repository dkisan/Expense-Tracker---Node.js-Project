const path = require('path')

const Expense = require('../model/expense')

exports.getExpensePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/expenseform.html'))
}

exports.getExpenses = async (req, res, next) => {
    try {
        const exp = await Expense.findAll()
        res.status(200).json(exp)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.postAddExpense = async (req, res, next) => {
    try {
        const exp = await Expense.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        })
        if (exp) {
            res.status(200).json({ message: 'Expense Added Successfully', id: exp.id })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.deleteExpense = async (req, res, next) => {
    console.log(req.body)
    try {
        const exp = await Expense.destroy({
            where: {
                id: req.body.id
            }
        })
        if (exp) {
            res.status(200).json({ message: 'Expense Deleted Successfully' })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}