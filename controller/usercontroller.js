const path = require('path')

const User = require('../model/user')

exports.gethome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/signup.html'))
}

exports.getlogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/login.html'))
}

exports.postsignup = async (req, res, next) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.send(user)
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
            if (req.body.password == user.password) {
                res.status(200).send({ message: "User Login Successfully" })
            } else {
                res.status(401).send({ message: "Incorrect Credentials" })
            }
        } else {
            res.status(404).send({ message: "User Not Found" })
        }
    }
    catch (err) {
        console.log('here')
        res.send(err)
    }
}