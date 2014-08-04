
module.exports = function (app,passport) {
    
    app.get('/', index); // API website TBD
    
    //BUYER
    
    //Product Search
    app.get('/product/:upc',ensureAuth, product.search); // Return array of matchin product and deals to buy.
    app.get('/product/:upc/:qty/:bid', ensureAuth, product.sendBid); // Basic bid, Return available options. [ Includes counter offers array ]
    
    //Available Deal
    app.get('/deal/join/:id', ensureAuth, deal.joinDeal); //Accepts Deal creates running.
    app.get('/deal/accept/:id', ensureAuth, deal.acceptDeal);
    app.get('/deal/:id', ensureAuth, deal.getDeal); //Offer Status and information;
    app.get('/deals/', ensureAuth, deal.getDeals); //Return all active deals for buyter
    
    //SELLERS
    app.get('/deals/seller', ensureAuth, deal.getSellerDeals); //Display all running offers for the seller.
    
    
    //listings
    app.get('/listings',ensureAuth ,listing.getAllProducts); // All listings of Seller
    app.post('/listings/product/:upc',ensureAuth ,listing.addProduct); //Add new Product 
    app.get('/listings/product/:upc',ensureAuth ,listing.getProduct); //Retrieve
    app.put('/listings/product/:upc',ensureAuth ,listing.updateProduct); //Update 
    app.delete('/listings/product/:upc',ensureAuth ,listing.deleteProduct); // Delete
    
    //Offer
    app.get('/offers',offer.getOffers); //Display all offers 
    app.get('/offers/:upc',offer.getOffersWithUPC); //Display all offers that have the given upc
    app.get('/offer/:id',offer.getOffer);  //Retrieve
    app.post('/offer',offer.addOffer); //Add
    app.put('/offer/:id',offer.updateOffer); //Update
    app.delete('/offer/:id',offer.deleteOffer); //Delete
    
    //TopSellers
    app.get('/topsellers',product.getTopSellers);

    //AUTH 
    app.get('/login', function(req,res){
        req.logout();
        res.redirect('/auth/amazon');
    });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/users',users.all); // Example 


    // Authentication.
    app.get('/auth/amazon',
          passport.authenticate('amazon', { scope: ['profile', 'postal_code'] }));
    
    app.get('/auth/amazon/callback', 
          passport.authenticate('amazon', { failureRedirect: '/Error' }),
          function(req, res) {
            res.redirect('/successLogin');
          });
          
    app.get('/successLogin',ensureAuth,function(req,res){
          var name = req.user.displayName;
          var date = new Date();
          if(!db.users.find({user_id: name}))
            db.users.insert({user_id: name, user_type: "customer", last_login: date});
          else
            db.users.update({user_id: name}, {$set: {last_login: date}}, {multi: true});
          
          // product.getTopSellers(req, res);
          res.send("Authenticated: " + name);
    });

};

var redirect = function(req, res) {
    res.redirect('/');
}

var index = function (req, res) {
    res.render('index', { title: 'Fair Shake' });
};


var ensureAuth = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.jsonp({auth:"false", message:"The user is not login.", url:"/login"});
}

var users = require(__dirname + '/users');
var product = require(__dirname + '/product');
var listing = require(__dirname + '/listings');
var deal = require(__dirname + '/deals');
var offer = require(__dirname + '/offer')

var aws = require("aws-lib");
prodAdv = aws.createProdAdvClient("AKIAIJRXMLXJTTOMB6CQ", "R7LSV2dWWWlZQ1fz4gOzKm/Roo2+qj+w2VXzrULq", "DSF2WFEYT65GHHR3EODK");
ObjectID = require('mongodb').ObjectID;
upcVerify = require(__dirname + "/../libs/upcVerify.js");