var util = require(__dirname + '/../libs/util.js'),
    mustache = require('mu2');

module.exports = function (express, app, passport) {

    // Common configuration
    app.configure(function () {

        // Configure mustache template engine
        mustache.root = __dirname + '/../views';
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'mustache');
        app.engine('mustache', function (path, options, fn) {
            var buffer = [];

            // Always recompile in development
            if (app.settings.env === 'development') {
                mustache.clearCache();
            }
            mustache.compileAndRender(path, options).on('data', function (data) {
                buffer.push(data);
            }).on('end', function () {
                fn(null, buffer.join(''));
            }).on('error', function (e) {
                fn(e);
            });
        });
        
        //passport config
        app.use(express.cookieParser("This is not real, life is a dream.")); 
        app.use(express.session({cookie: { maxAge : 3600000 } }));
        app.use(passport.initialize());
        app.use(passport.session());
        
        app.use(express.bodyParser());
        
        app.use(app.router);

        // Make sure build folders exist
        util.mkdir(__dirname + '/../build');
        util.mkdir(__dirname + '/../build/css');

        // Configure LESS compiler
+       app.use('/css', require('less-middleware')(__dirname + '/../src/less', {
            dest: __dirname + '/../build/css'
        }));

        // Create static file servers for the build and public folders
        app.use(express.static(__dirname + '/../build'));
        app.use(express.static(__dirname + '/../public'));
    });

    // Development specific configuration
    app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    // Production specific configuration
    app.configure('production', function () {
        app.use(express.errorHandler());
    });

};
