// Argument parsing using the optimist module
var port = process.env.PORT || 3000;

module.exports = require('optimist')
    .usage('Usage: $0 --port [port]')
    .alias('port', 'p')
    .describe('port', 'Port number for the Express application.')
    .default('port', port)
    .argv;
