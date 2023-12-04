const express = require('express')
const router = express.Router()

const expensecontroller = require('../controller/expensecontroller')

router.get('/dashboard',expensecontroller.getExpensePage)
router.get('/getexpense',expensecontroller.getExpenses)
router.post('/addexpense',expensecontroller.postAddExpense)
router.delete('/deleteexpense',expensecontroller.deleteExpense)

module.exports = router;