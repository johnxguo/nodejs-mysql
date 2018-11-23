var db = require('./db');
var dbconfig = require('./dbconfig');
var fs = require('fs')

// db.init(dbconfig.mysqlCfg, dbconfig.sshCfg)

db.init(dbconfig.mysqlCfg)
db.query('SELECT * FROM mysql.db LIMIT 0, 10; ', function(error, results, fields){
	fs.writeFile('./1.json', JSON.stringify(results), function (err) {
		if (err) {
			console.log(err)
		} else {
			console.log('query succ!')
		}
	})
})
