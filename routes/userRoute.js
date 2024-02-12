// requiring  important dependencies
const express = require('express')
const { loginController, registerController } = require('../controllers/userController')

//router object
const router = express.Router()

/*-----routers----*/
//post || Login
router.post('/login',loginController)

//post || RegisterUser
router.post('/register',registerController)
//export
module.exports = router








































