let cookie = require("cookie-parser");
let utility = require("../utility/utility");
const { eseguiQuery } = require('../utility/utility');


module.exports = function (app, connection) {

    app.use(cookie());

    //table users 
    const users = "users"

    //rows users
    const ID = "id"
    const username = "name"


    //table usersessions
    const usersessions = "usersessions"

    //rows userssession
    const token_session = "token"
    const id_user_session = "id_user"
    const date_session = "date_session"

    app.use('/apiV2/', async (req, res, next) => {
        let token = req.cookies.token;
        let status = 0
        let error = null
        let reply
        if (token != undefined) {
            if (token.length == 30) {
                var result = await eseguiQuery(connection, "SELECT " + token_session + "  FROM " + usersessions + " WHERE " + token_session + " = ?", [token]).catch((err) => {
                    console.log(err)
                    error = 1
                });
                if (error == null && result.length == 1 && result) {
                    next()
                }
                else if (error == 1) {
                    status = -1
                    error = "Not valid Token"
                    reply = "failed"
                }
            }
        }
        if (!result || result == 0 && error == null || token.length != 30 || token.length == undefined) {
            res.statusCode = 401;
            res.send()
        }
        console.log(token)
    });
}