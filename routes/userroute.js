const express = require('express')
const router = express.Router()

const usercontroller = require('../controller/usercontroller')

router.get('/',usercontroller.gethome)

module.exports = router;