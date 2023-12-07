const path = require('path')

const bcrypt = require('bcrypt')
const saltRounds = 10

const AWS = require('aws-sdk')

const jwt = require('jsonwebtoken')
const pvtkey = 'backendencryptstring'

const Expense = require('../model/expense')
const User = require('../model/user')

const Razorpay = require('razorpay')
const sequelize = require('../util/database')

const { v4: uuidv4 } = require('uuid');
const Forgotpassword = require('../model/forgetpassword')


exports.getExpensePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/expenseform.html'))
}

exports.getResetPasswordPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/forgotpassword.html'))
}

exports.postResetPassworduuid = async (req, res, next) => {
    const u = await Forgotpassword.findOne({
        where: {
            id: req.params.uuid
        }
    })
    if (u.isactive) {
        await u.update({
            isactive: false
        })
        res.sendFile(path.join(__dirname, '../', 'view', '/updatepassword.html'))
    } else {
        res.send('<h3>Session Expired</h3>')
    }
}

exports.postUpdatePassword = async (req, res, next) => {

    try {
        const u = await Forgotpassword.findOne({
            where: {
                id: req.body.uuid
            },
            attributes: ['userId']
        })
        const user = await User.findOne({
            where: {
                id: u.userId
            }
        })
        let password = req.body.password;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {

                await user.update({
                    password: hash
                })
                return res.status(200).json({ message: 'Password Updated Successfully' })
            })
        })
    } catch (err) {
        return res.status(500).json(err)
    }

}

exports.postResetPassword = async (req, res, next) => {
    const t = await sequelize.transaction()
    const user = await User.findOne({
        where: {
            email: req.body.email
        },
        attributes: ['id']
    })
    const uuid4 = uuidv4();
    await Forgotpassword.create({
        id: uuid4,
        userId: user.id,
        isactive: true
    },
        { transaction: t })
    var SibApiV3Sdk = require('sib-api-v3-sdk');
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.smtp_key;
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
        email: 'admin@gmail.com'
    }

    const receivers = [
        {
            email: req.body.email
        }
    ]

    try {
        const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: `Password Reset Link <a href="http://localhost:3000/expense/password/resetpassword/${uuid4}">Click Here</a>`
        })
        console.log(sendEmail, req.body.email)
        await t.commit()
    } catch (err) {
        console.log(err.message)
        await t.rollback()
    }




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
    const t = await sequelize.transaction()
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
        },
            { transaction: t }
        )
        if (p) {
            await user.update({
                ispremium: true
            },
                { transaction: t }
            )
            await t.commit()
            return res.status(201).json({ message: 'You are a now a Premium Member' })
        }
    } catch (err) {
        await t.rollback()
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
    const t = await sequelize.transaction()
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
        },
            { transaction: t }
        )
        if (exp) {
            await user.update({
                totalexpense: user.totalexpense + +exp.amount
            },
                { transaction: t }
            )
            await t.commit()
            return res.status(200).json({ message: 'Expense Added Successfully', id: exp.id })
        } else {
            return res.status(500).json({ message: 'some error occured' })
        }
    } catch (err) {
        await t.rollback()
        console.log(err.message)
        return res.status(500).json(err)
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction()
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
            },
                { transaction: t }
            )
            await user.update({
                totalexpense: user.totalexpense - exp[0].dataValues.amount
            },
                { transaction: t }
            )
            await t.commit()
            return res.status(200).json({ message: 'Expense Deleted Successfully' })
        } else {
            return res.status(500).json({ message: 'Some Error occured' })
        }
    } catch (err) {
        await t.rollback()
        return res.status(500).json(err)
    }
}

exports.getLeaderboard = async (req, res, next) => {
    // const t = await Expense.findAll({
    //     include:[{
    //         model:User,
    //         attributes:['name']
    //     }],
    //     attributes: [
    //         [sequelize.fn('sum', sequelize.col('amount')), 'total']
    //     ],
    //     group: ['userId'],
    //     order: [['total', 'DESC']]
    // })
    // return res.json(t)

    const l = await User.findAll({
        attributes: ['name', 'totalexpense'],
        order: [['totalexpense', 'DESC']]
    })
    return res.json(l)
}

function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {

        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something Went Wrong')
                reject(err)
            } else {
                console.log('Success', s3response)
                resolve(s3response.Location)
            }
        })
    })
}


exports.downloadExpenses = async (req, res, next) => {
    const uid = jwt.verify(req.body.uid, pvtkey, (err, decoded) => {
        if (err) throw new Error;
        return decoded
    })
    const user = await User.findOne({
        where: {
            id: uid
        }
    })
    const expenses = await user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses)
    const dt = new Date()
    const filename = `Expense_${dt}.txt`
    const fileurl = await uploadToS3(stringifiedExpenses, filename);
    return res.status(200).json({ fileurl, success: true })
}



