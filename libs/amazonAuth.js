AmazonStrategy = require('passport-amazon').Strategy;

module.exports = function(express, app, passport){

		
	var hostname = process.env.NODE_DEV || process.argv[3] || 'http://127.0.0.1:3000';
	var AMAZON_CLIENT_ID = "";
    var AMAZON_CLIENT_SECRET = "";
    
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });	

	passport.use(new AmazonStrategy({
		clientID: AMAZON_CLIENT_ID,
		clientSecret: AMAZON_CLIENT_SECRET,
		callbackURL: hostname + "/auth/amazon/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
		var date_ = new Date();
		db.login.insert({user:profile.id , date: date_.toJSON()}, function(err, res){
			
			if(err) console.log(err);
			
			process.nextTick(function () {
				console.log(profile);
				return done(null, profile);
			});
		});
		
	  }
	))
}	
	
