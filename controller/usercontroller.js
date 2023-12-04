const path = require('path')

const User = require('../model/user')

exports.gethome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'view', '/signup.html'))
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