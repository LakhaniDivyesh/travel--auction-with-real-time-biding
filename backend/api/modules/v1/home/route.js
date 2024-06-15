var express = require('express');
var router = express.Router();
var home_model = require("./home_model");
var common = require("../../../config/common");
const middleware = require('../../..//middleware/validators');
const { t } = require('localizify');


//APIs
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './public/images') 
    },
    filename: function (req, file, cb) {
        var file_name = `${Date.now()}-vacation-${file.originalname}`
        req.body.image = file_name; 
        cb(null, file_name)
        
    }
});

var upload = multer({
    storage: storage
});

// create new package
router.post("/add-package",upload.single('image'), function (req, res) {
    var request = req.body
    var rules = {
        name:"required",
        description:"required",
        image : 'required',
        days : 'required',
        night : 'required',
        base_price : 'required',
        destination : 'required',
        auction_start_date : 'required',
        auction_end_date : 'required',
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.addPackage(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

// place Bid
router.post("/place-bid", function (req, res) {
    var request = req.body
    var rules = {
        price : 'required',
        package_id : 'required',
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.placedBid(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

// listing package
router.post("/listing-package", function (req, res) {
    var request = req.body

    request.user_id = req.user_id
    home_model.listingPackage(request, function (code, message, data) {
        common.response(req, res, code, message, data);
    })

});

// listing bids
router.post("/listing-bids", function (req, res) {
    var request = req.body

    var rules = {
        package_id : 'required',
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.listingBids(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }
    

});

// listing my bids
router.post("/listing-my-bids", function (req, res) {
    var request = req.body

    request.user_id = req.user_id
    home_model.listingMyBids(request, function (code, message, data) {
        common.response(req, res, code, message, data);
    })

});



module.exports = router