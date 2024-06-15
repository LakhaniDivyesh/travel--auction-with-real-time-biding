var conn = require('./database');
var constant = require('./constant');
var middleware = require('../middleware/validators');
var nodemailer = require('nodemailer');
const { default: localizify } = require('localizify');
const { t } = require('localizify');

var common = {

    // Response
    response: function (req, res, code, message, data) {

        this.getMessage(req.lang, message, function (translated_message) {

            var response = {
                code: code,
                message: translated_message,
                data: data
            };

            if (code == 0) {
                res.status(401).send(response);

            } else {
                res.status(200).send(response);
            }

        })

    },

    //get translated message
    getMessage: function (language, message, callback) {
        callback(t(message.keyword, message.content));
    },

    checkEmail: function (email, callback) {

        var q = `select id from tbl_users where email = ? and is_active = 1 and is_deleted = 0;`

        conn.query(q, email, function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        })

    },

    checkBookingEmail: function (email, callback) {

        var q = `select id from tbl_booking where email = ? and is_active = 1 and is_deleted = 0;`

        conn.query(q, email, function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        })

    },

    checkUsername: function (username, callback) {

        var q = `select id from tbl_users where username = ? and is_active = 1 and is_deleted = 0;`

        conn.query(q, username, function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        })

    },

    checkUserExist: function (user_id, callback) {

        var q = `select id from tbl_preferences where user_id = ${user_id}`

        conn.query(q, function (error, result) {
            if (!error && result.length > 0) {

                var q = `select id from tbl_wishlist_destination where user_id = ${user_id}`

                conn.query(q, function (error, result) {
                    if (!error && result.length > 0) {
                        callback(true);
                    } else {
                        console.log(error);
                        callback(false)
                    }
                })

            }else {
                console.log(error);
                callback(false);
            }
        })

    },


    checkCart: function (user_id, book_id, callback) {

        var q = `select id from tbl_cart where user_id = ? and book_id = ? and is_active = 1 and is_deleted = 0;`

        conn.query(q, [user_id, book_id], function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        })

    },

    //Generate Random Token
    generateToken: (length = 10) => {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for (var i = 0; i < length; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    },

    //send eMail
    sendEmail: function (to_email, subject, message, callback) {

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.EMAIL_ID,
            to: to_email,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Email sent: ' + info.response);
                callback(true);
            }
        });
    },
};


module.exports = common;