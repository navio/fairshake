var express = require('express'),
    http = require('http'),
    app = express(),
    passport = require('passport'),
    opts = require(__dirname + '/config/opts.js');
    
    db = require(__dirname + '/db');
    
// Load express configuration
require(__dirname + '/config/env.js')(express, app, passport);

// Load passport
require(__dirname + '/libs/amazonAuth.js')(express, app, passport);

// Load routes
require(__dirname + '/routes')(app, passport);

// Start the server
http.createServer(app).listen(opts.port, function () {
    console.log("Express server listening on port %d in %s mode",
                opts.port, app.settings.env);
});
