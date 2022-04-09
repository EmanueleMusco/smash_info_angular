let parser = require("body-parser");
let cookie = require("cookie-parser");
var cors = require('cors')
const utility = require("./Function/utility/utility");
const { eseguiQuery } = require('./Function/utility/utility');




module.exports = function (app, connection) {

    var corsOptions = {
        origin: 'http://127.0.0.1:13998',
        credentials: true 
    }

    app.use(cors(corsOptions))
    app.use(parser.json())
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
    const id_sessions = "id"
    const address_user = "address"
    //token 
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!=&1234567890";
    const length = 30;

    addressEdit = function (){
        let user_address = String(address).replace(/[:f]/gi, '');
        return user_address
    }

    genToken = function () {
        let token = ""
        for (let i = 0; i < length; i++) {
            const randomNum = Math.floor(Math.random() * characters.length);
            token += characters[randomNum];
        }
        return token;
    }
 

    app.post('/Smash_Info/new/user', async (req, res,socket) => {
        let nome = req.body.username
        let ip_user = req.body.ip
        let token = ""
        let error = null
        let status = 0
        let reply
        if (nome != undefined && id_user != undefined) {
            if (isNaN(nome)) {
                if (nome.length < 15 && nome.length > 3) {
                    var result = await eseguiQuery(connection, "SELECT id , name  FROM users  WHERE name = ?", [nome]).catch((err) => {
                        console.log(err)
                        error = 1
                    });
                    if (result.length == 0) {
                        token = genToken()
                        ip_user = addressEdit()
                        let result = await eseguiQuery(connection, "INSERT INTO users (name) VALUES (?);", [nome]).catch((err) => {
                            console.log(err)
                            error = 1
                            status = -1
                        });
                        id_user = result.insertId
                        let result2 = await eseguiQuery(connection, "INSERT INTO usersessions (token , id_user , address) VALUES (?,?,?);", [token, id_user,ip_user]).catch((err) => {
                            console.log(err)
                            error = 1
                            status = -1
                        });
                        if (error == null) {
                            reply = token
                            res.cookie("token", token);
                        }
                        else if (error == 1) {
                            status = -1
                            error = "problem of query mysql"
                            reply = "failed"
                        }
                    } else {
                        status = -1
                        error = "Name is already registered to another member"
                        reply = "failed"
                    }
                } else {
                    status = -1
                    error = "Name lenght not valid"
                    reply = "failed"
                }
            } else {
                status = -1
                error = "No valid Name"
                reply = "failed"

            }
        } else {
            status = -1
            error = "Name is not valid"
            reply = "failed"
        }
        res.json({ code: status, result: reply, error: error })
    });


    app.get('/apiV2/Smash_Info/get/name', async (req, res) => {
        let token = req.cookies.token;
        let status = 0
        let error = null
        let reply
        var result = await eseguiQuery(connection, "SELECT " + users + "." + ID + " , " + username + " , " + usersessions + "." + token_session + " as " + token_session + " FROM " + users + " LEFT JOIN  " + usersessions + " on " + usersessions + "." + id_sessions + " = " + users + "." + ID + " WHERE " + token_session + " = ?", [token]).catch((err) => {
            error = 1
        });
        if (error == 1) {
            status = -1
            error = "problem of query mysql"
            reply = "failed"
        } else if (error == null && result.length == 0) {
            status = -1
            error = "Not user Exist"
            reply = "failed"
        } else if (error == null && result.length != 0) {
            reply = result
        }
        res.json({ code: status, result: reply, error: error })
    });

    app.post('/apiV2/Smash_Info/update/name', async (req, res) => {
        let nome = req.body.username
        let token = req.cookies.token;
        let id_user = 0
        let error = null
        let status = 0
        let reply
        if (nome != undefined && nome != "" && isNaN(nome)) {
            if (nome.length <= 15 && nome.length >= 3) {
                var result = await eseguiQuery(connection, "SELECT " + username + " FROM " + users + " WHERE " + username + " = ?", [nome]).catch((err) => {
                    error = 1
                });
                
                if (result.length == 0) {
                    var result = await eseguiQuery(connection, "SELECT " + users + "." + ID + " , " + username + " , " + usersessions + "." + token_session + " as " + token_session + " FROM " + users + " LEFT JOIN  " + usersessions + " on " + usersessions + "." + id_sessions + " = " + users + "." + ID + " WHERE " + token_session + " = ? ", [token]).catch((err) => {
                        console.log(err)
                        error = 1
                    });
                    id_user = result[0].id
                    if(id_user != 0 && result.length!=0)
                    {
                        let result = await eseguiQuery(connection, "UPDATE  " + users + "  SET " + username + " = ? WHERE " + ID + " = ?", [nome, id_user]).catch((err) => {
                            console.log(err)
                            error = 1
                            status = -1
                        });
                        if (error == null) {
                            reply = "Name changed"
                        }
                    }else{
                        status = -1
                        error = "User not Found"
                        reply = "failed"
                    }   
                    if (error == 1) {
                        status = -1
                        error = "problem of query mysql"
                        reply = "failed"
                    }
                } else {
                    status = -1
                    error = "Name is already registered to another member"
                    reply = "failed"
                }
            } else {
                status = -1
                error = "Name lenght not valid"
                reply = "failed"
            }
        } else {
            status = -1
            error = "Data not valid"
            reply = "failed"
        }
        res.json({ code: status, result: reply, error: error })
    });

    app.post('/apiV2/Smash_Info/delete/name', async (req, res) => {
        let token = req.cookies.token;
        let id_user  = null
        let error = null
        let status = 0
        let reply
        if (token) {
            var result = await eseguiQuery(connection, "SELECT " + users + "." + ID + " , " + username + " , " + usersessions + "." + token_session + " as " + token_session + " FROM " + users + " LEFT JOIN  " + usersessions + " on " + usersessions + "." + id_sessions + " = " + users + "." + ID + " WHERE  " + token_session + " = ?", [token]).catch((err) => {
                console.log(err)
                error = 1
            });
            id_user = result[0].id
            if (result.length != 0) {
                let result = await eseguiQuery(connection, "DELETE FROM " + users + " WHERE " + ID + " = ? ;", [id_user]).catch((err) => {
                    console.log(err)
                    error = 1
                    status = -1
                });
                let result2 = await eseguiQuery(connection, "DELETE FROM " + usersessions + " WHERE " + id_user_session + " = ? ;", [id_user]).catch((err) => {
                    console.log(err)
                    error = 1
                    status = -1
                });
                if (error == null) {
                    reply = "userd delete"
                }
            } else {
                status = -1
                error = "User not Exist"
                reply = "failed"
            }
            if (error == 1) {
                status = -1
                error = "problem of query mysql"
                reply = "failed"
            }
        } else {
            status = -1
            error = "Error"
            reply = "failed"
        }
        res.json({ code: status, result: reply, error: error })
    });
}