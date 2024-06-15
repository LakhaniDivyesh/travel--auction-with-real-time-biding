var express = require('express');
var router = express.Router();
var auth_model = require("./auth_model");
var common = require("../../../config/common");
const middleware = require('../../../middleware/validators');
const { t } = require('localizify');


//APIs

//Login
router.post("/login", function (req, res) {
    request = req.body

    var rules = {
        email: "required",
        password: "required"
    }

    var message = {
        required: t('required')
    }

    if (middleware.checkValidationRules(res, request, rules, message)) {
        auth_model.login(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

//signup
router.post("/signup", function (req, res) {
    request = req.body

    var rules = {
        name: 'required',
        email: 'required|email',
        password: "required",
        role : 'required'
    }

    var message = {
        required: t('required'),
        email: t('valid'),
    }

    if (middleware.checkValidationRules(res, request, rules, message)) {
        auth_model.signup(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

router.post("/set-profile", function (req, res) {
    request = req.body
    var rules = {
        destination :'required',
        preference : 'required'
    }

    var message = {
        required: t('required'),
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        auth_model.setProfile(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

    

});


//listing preference and destination
router.post("/listing-profile-details", function (req, res) {
    request = req.body


    request.user_id = req.user_id
    auth_model.listingProfileDetails(request, function (code, message, data) {
        common.response(req, res, code, message, data);
    })

    

});


router.post("/logout", function (req, res) {
    request = req.body

    request.user_id = req.user_id
    auth_model.logout(request, function (code, message, data) {
        common.response(req, res, code, message, data);
    })

});



module.exports = router