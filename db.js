let db_config = require('./settings/db_config');
let mysql = require('mysql');
let connection = mysql.createConnection(db_config);
connection.connect();
exports.mysql = mysql;
exports.connection = connection;
