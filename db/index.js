var databaseURI = process.argv[2] || 'mongodb://'; //Mongo URL

var collections = ['users','login','product','deal','offer'];

var db = require('mongojs').connect(databaseURI,collections);

module.exports = db;
