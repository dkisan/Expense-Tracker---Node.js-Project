const express = require('express')
const router = express.Router()

const usercontroller = require('../controller/usercontroller')

router.get('/',usercontroller.gethome)

router.post('/user/signup',usercontroller.postsignup)

module.exports = router;