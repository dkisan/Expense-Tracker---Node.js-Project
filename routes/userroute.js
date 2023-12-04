const express = require('express')
const router = express.Router()

const usercontroller = require('../controller/usercontroller')

router.get('/',usercontroller.gethome)
router.get('/login',usercontroller.getlogin)

router.post('/user/signup',usercontroller.postsignup)
router.post('/user/login',usercontroller.postlogin)


module.exports = router;