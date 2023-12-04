const path = require('path')

const bcrypt = require('bcrypt')
const saltRounds = 10


const User = require('../model/user')

exports.gethome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/signup.html'))
}

exports.getlogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/login.html'))
}

exports.postsignup = async (req, res, next) => {
    try {
        let password = req.body.password;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {

                const user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                res.send(user)
            })
        })
    }
    catch (err) {
        res.send(err)
    }
}

exports.postlogin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    res.status(200).send({ message: "User Login Successfully" })
                } else {
                    res.status(401).send({ message: "Incorrect Credentials" })
                }
            })
        } else {
            res.status(404).send({ message: "User Not Found" })
        }
    }
    catch (err) {
        res.send(err)
    }
}