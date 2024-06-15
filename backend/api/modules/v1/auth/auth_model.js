var conn = require("../../../config/database");
var common = require("../../../config/common");
// var constant = require("../../../../config/constant");
var md5 = require('md5');
var asyncLoop = require('node-async-loop');

var auth_model = {

    //Login
    login: function (request, callback) {

        var login = `select * from tbl_users where email = ? and password = ? and is_active = 1 and is_deleted = 0;`
        var condition = [request.email, md5(request.password)]

        conn.query(login, condition, function (error, result) {
            if (error) {
                callback('0', { keyword: 'sql_error', content: { error: "login" } }, error);
            } else {

                if (result.length > 0) {
                    var token = common.generateToken()
                    var update_token = `update tbl_users set token = '${token}' where id = ${result[0].id}`

                    conn.query(update_token, function (error, updateToken) {
                        if (!error && updateToken.affectedRows > 0) {
                            var data = {
                                name: result[0].name,
                                email: result[0].email,
                                role: result[0].role,
                                token: token
                            }
                            callback('1', { keyword: 'successfully_login', content: {} }, [data]);
                        } else {
                            callback('0', { keyword: 'sql_error', content: { error: "login" } }, error);
                        }
                    })

                } else {
                    callback('0', { keyword: 'Invalid_credential', content: {} }, result);
                }

            }
        })

    },

    //Signup
    signup: function (request, callback) {
        var queryData = {
            name: request.name,
            email: request.email,
            password: md5(request.password),
            role: request.role,
            token: common.generateToken()
        }

        common.checkEmail(request.email, function (response) {

            if (response) {
                callback('0', { keyword: 'email_exist', content: {} }, []);
            } else {

                var signup = `INSERT INTO tbl_users SET ?;`

                conn.query(signup, queryData, function (error, userData) {
                    if (error) {
                        callback('0', { keyword: 'sql_error', content: { error: "signup" } }, error);
                    } else {

                        var user = `Select name,email,token,role from tbl_users where id = ${userData.insertId} and is_active = 1 and is_deleted = 0;`

                        conn.query(user, function (error, result) {
                            if (!error && result.length > 0) {
                                callback('1', { keyword: 'success_signup', content: {} }, result);
                            } else {
                                callback('0', { keyword: 'sql_error', content: { error: "get user data" } }, error);
                            }
                        })
                    }
                })
            }
        });
    },

    setProfile: function (request, callback) {
        var queryData1 = {
            user_id: request.user_id,
            preferences: `${request.preference}`
        }

        var queryData2 = {
            user_id: request.user_id,
            destination: `${request.destination}`
        }

        common.checkUserExist(request.user_id, function (response) {

            if (response === false) {
                var profile = `INSERT INTO tbl_preferences set ?;`

                conn.query(profile, queryData1, function (error, result) {
                    if (!error) {

                        var profile = `INSERT INTO tbl_wishlist_destination set ?;`

                        conn.query(profile, queryData2, function (error, result) {
                            if (!error) {
                                callback('1', { keyword: 'profile_success', content: {} }, result);
                            } else {
                                console.log(error);
                                callback('0', { keyword: 'profile_not_set', content: {} }, error);
                            }
                        })

                    } else {
                        console.log(error);
                        callback('0', { keyword: 'profile_not_set', content: {} }, error);
                    }
                })
            } else {
                var profile = `UPDATE tbl_preferences set ? where user_id = ${request.user_id};`

                conn.query(profile, queryData1, function (error, result) {
                    if (!error) {
                        var profile = ` UPDATE tbl_wishlist_destination set ? where ${request.user_id};`

                        conn.query(profile, queryData2, function (error, result) {
                            if (!error) {
                                callback('1', { keyword: 'profile_success', content: {} }, result);
                            } else {
                                console.log(error);
                                callback('0', { keyword: 'profile_not_set', content: {} }, error);
                            }
                        })
                    } else {
                        console.log(error);
                        callback('0', { keyword: 'profile_not_set', content: {} }, error);
                    }
                })
            }
        });


    },

    listingProfileDetails: function (request, callback) {
        profile = `select * from tbl_preferences where user_id = ${request.user_id};
                    select * from tbl_wishlist_destination where user_id = ${request.user_id}`

        conn.query(profile, function (error, result) {
            if (!error ) {
                if(result.length > 0){
                    callback('1', { keyword: 'data_found', content: {} }, result);
                }else{
                    callback('1', { keyword: 'data_not_found', content: {} }, result);
                }
                
            } else {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "listing profile details" } }, error);
            }
        })

    },

    // Logout
    logout: function (request, callback) {
        const logoutUser = `UPDATE tbl_users SET token = null WHERE id = '${request.user_id}';`;

        conn?.query(logoutUser, function (error, logout) {
            if (!error && logout?.affectedRows > 0) {
                callback("1", { keyword: "logout_success", content: "" }, []);
            } else {
                callback("0", { keyword: "error", content: { error: "logout" } }, []);
            }
        });
    },

}

module.exports = auth_model