// BASE URL :- http://localhost:8000/auth/forget
var express = require('express');
const { param, body } = require('express-validator');
const { authErrors, emailNotExists } = require('../../../services/authServices/errHandler');
const { userForget, companyForget, userPassReset, companyPassReset } = require('../../../services/authServices/forget');

var router = express.Router();

/*  POST Route :- Forget Password Email Verfication
    Req Body :- {email}
    Res Body :- {msg: "...", success: true} , if Sucessfully Verfied
                {err: "...", success: false} , if Any Error Occurs */
router.post('/', [
    body('email').notEmpty().withMessage('Email Should Not Be Empty!!')
], authErrors, emailNotExists, userForget, companyForget)

/*  PUT Route :- Resetting The Password
    Req Body :- {newPassword}
    Res Body :- {msg: "...", success: true} , if Sucessfully Reset
                {err: "...", success: false} , if Any Error Occurs */
router.put('/:type/:token', [
    param('type').isIn(["U", "C"]).withMessage("Invalid Request!!"),
    body('newPassword').isLength({min: 8}).withMessage('Password should be greater than equal to 8')
                       .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
                       .withMessage('Password must contain alphabets, numbers & symbols')
], authErrors, userPassReset, companyPassReset)

module.exports = router;