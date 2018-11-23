var mysql = require('mysql2');
var SSHClient = require('ssh2').Client;
var sshclient = new SSHClient();

var pool = null
var db = {}

db.querys = []
db.init = function(mysqlCfg, sshCfg) {
    if (sshCfg) {
        sshclient.on('ready', function() {
            sshclient.forwardOut(
                '127.0.0.1',
                12345,
                mysqlCfg.host,
                mysqlCfg.port,
                function (err, stream) {
                    if (err) {
                        throw err; 
                    }
                    pool = mysql.createPool(Object.assign(mysqlCfg, {stream:stream}));
                    while (db.querys.length > 0) {
                        var param = db.querys.pop()
                        if (param.length != 2) {
                            continue
                        }
                        db.query(param[0], param[1])
                    }
                }
            );
        }).connect(sshCfg);
    } else {
        pool = mysql.createPool(mysqlCfg);
    }
}

var conn = null

db.query = function(sql, callback) {
    if (!sql) {
        callback()
        return
    }
    if (pool) {
        pool.query(sql, function(error, rows, fields) {
            callback(error, rows, fields)
        })
    } else {
        db.querys.push([sql, callback])
    }
}

module.exports = db;