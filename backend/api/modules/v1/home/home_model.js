var conn = require("../../../config/database");
var common = require("../../../config/common");
var constant = require("../../../config/constant");
var template = require("../../../config/template")
// var md5 = require('md5');
var asyncLoop = require('node-async-loop');


var home_model = {

    //add new package
    addPackage: function (request, callback) {

        var queryData = {
            travel_service_provider_id: request.user_id,
            name: request.name,
            description: request.description,
            image: request.image,
            days: request.days,
            night: request.night,
            base_price: request.base_price,
            destination: request.destination,
            auction_start_date: request.auction_start_date,
            auction_end_date: request.auction_end_date,
        }

        var event = `INSERT INTO tbl_vacation_package SET ?;`

        conn.query(event, queryData, function (error, result) {
            if (!error) {
                callback('1', { keyword: 'success_package', content: {} }, []);
            } else {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "event" } }, error);
            }
        })
    },

    //listing package
    listingPackage: function (request, callback) {

        if (request.provider) {
            var q = `vp.travel_service_provider_id = ${request.user_id} and`
        } else {
            var q = ``
        }

        var package = `select vp.*,CONCAT('${constant.IMAGE}',vp.image) as image,u.id as provider_id, u.name as provider_name,u.email
         from tbl_vacation_package vp join tbl_users u on vp.travel_service_provider_id = u.id  where ${q} vp.is_active = 1 and vp.is_deleted = 0`

        conn.query(package, function (error, result) {
            if (error) {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "listing package" } }, []);
            } else if (result.length > 0) {

                asyncLoop(result, (item, next) => {

                    var insertQuery = `select max(b.price) as winner_price,u.name as user_name from tbl_bid b join tbl_users u on b.user_id = u.id where b.package_id = ${item.id}`
                    conn.query(insertQuery, function (nestedError, nestedResult) {
                        item.bid = nestedResult
                        next();

                    })


                }, (error) => {
                    if (error) {
                        callback('0', { keyword: 'sql_error', content: { error: "nested data" } }, []);
                    } else {

                        callback('1', { keyword: 'data_found', content: {} }, result);

                    }
                })

            } else {
                callback('1', { keyword: 'data_not_found', content: {} }, result);
            }
        })
    },
    placedBid: function (request, callback) {
        var max = `select max(price)as max_price from tbl_bid where package_id = ${request.package_id}`
        conn.query(max, function (error, result) {
            if(error){

            }else{
                if(result.length < 0 || result[0].max_price < request.price){

                    var queryData = {
                        user_id : request.user_id,
                        package_id : request.package_id,
                        price : request.price
                    }

                    var bid = `INSERT INTO tbl_bid set ? `
                    conn.query(bid,queryData, function (error, bidData) {
                        if (error) {
                            console.log(error);
                            callback('0', { keyword: 'sql_error', content: { error: "listing package" } }, []);
                        }else{
                            callback('1', { keyword: 'bid_placed', content: {} }, []);
                        }
                    })

                }else{
                    callback('0', { keyword: 'less_price', content: {} }, []);
                }
            }

        })
    },

    listingBids:function(request,callback){
        var bid = `select b.*,u.name from tbl_bid b join tbl_users u on b.user_id = u.id where b.package_id = ${request.package_id} order by b.created_at desc`
        conn.query(bid,function (error, bidData) {
            if (error) {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "listing package" } }, []);
            }else{
                if(bidData.length > 0){
                    callback('1', { keyword: 'data_found', content: {} },bidData);
                }else{
                    callback('1', { keyword: 'data_not_found', content: {} }, []);
                }
                
            }
        })
    },

    listingMyBids:function(request,callback){
        var package = `select vp.*,CONCAT('${constant.IMAGE}',vp.image) as image,u.id as provider_id, u.name as provider_name,u.email
         from tbl_vacation_package vp join tbl_users u on vp.travel_service_provider_id = u.id join tbl_bid b on b.package_id = vp.id  where b.user_id = ${request.user_id} and  vp.is_active = 1 and vp.is_deleted = 0 group by b.user_id`

        conn.query(package, function (error, result) {
            if (error) {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "listing package" } }, []);
            } else if (result.length > 0) {

                asyncLoop(result, (item, next) => {

                    var insertQuery = `select max(b.price) as winner_price,u.name as user_name from tbl_bid b join tbl_users u on b.user_id = u.id where b.package_id = ${item.id}`
                    conn.query(insertQuery, function (nestedError, nestedResult) {
                        item.bid = nestedResult
                        next();

                    })


                }, (error) => {
                    if (error) {
                        callback('0', { keyword: 'sql_error', content: { error: "nested data" } }, []);
                    } else {

                        callback('1', { keyword: 'data_found', content: {} }, result);

                    }
                })

            } else {
                callback('1', { keyword: 'data_not_found', content: {} }, result);
            }
        })
    }

}

module.exports = home_model