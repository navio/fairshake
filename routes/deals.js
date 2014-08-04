module.exports = {

  acceptDeal: function(req, res) {
    var user = req.user.id;
    var offer_id = req.params.id;

    isOfferValid(offer_id, function(result) {
      if (result) {
        db.offer.findOne({
          _id: ObjectID(offer_id)
        }, function(err, offer) {
          var endTime = new Date();
          endTime.setMinutes(endTime.getMinutes() + offer.run_time);

          var upc = offer.upc;
          var seller = offer.seller;
          var num_prod = offer.num_prod;

          db.product.update({
            product: upc
            , user: seller
          }, {
            $inc: {
              qty: -parseInt(num_prod)
              , reserve: parseInt(num_prod)
            }
          }, function(err, result) {
            if (err) {
              console.log(err);
            }
          });

          db.deal.insert({
            upc: upc
            , price: offer.price
            , total: num_prod
            , commiter: [user]
            , timeLeft: endTime
            , seller: seller
          }, function(err, result) {
            if (err) {
              res.jsonp({
                error: "Error creating deal"
              });
              return;
            } else {
              res.jsonp({
                success: "Deal has started"
              });
            }
          });
        });
      } else {
        res.jsonp({
          error: "The deal is no longer available"
        });
      }
    });
  },

  joinDeal: function(req, res) {
    var user = req.user.id;
    var deal = req.params.id;

    isDealActive(deal, user, function(result) {
      if (result) {
        db.deal.findAndModify({
          query: {
            _id: ObjectID(deal)
          },
          update: {
            $push: {
              commiter: user
            }
          }
        }, function(err, data) {
          if (err) {
            console.log(err);
            res.jsonp({
              error: "error joining the deal."
            });
          } else {
            res.jsonp({
              success: "Successfully commit to the deal"
              , deal: deal
            });
          }
        });
      } else {
        res.jsonp({
          error: "The deal is no longer available"
        });
      }
    });

  },

  getDeal: function(req, res) {
    var id = req.params.id;

    db.deal.find({
      _id: ObjectID(id)
    }, function(err, deal) {
      if (err) {
        res.jsonp({
          error: "Error retreiving deal with id"
        })
      } else {
        res.jsonp(deal);
      }
    });
  },


  getDeals: function(req, res) {
    var user = req.user.id;
    console.log('da', user);
    db.deal.find({
      commiter: {
        $in: [user]
      }
    }, function(err, deals) {
      if (err) {
        res.jsonp({
          error: "Error retreiving deals from the database"
        })
      } else {
        res.jsonp(deals);
      }
    });
  },

  getSellerDeals: function(req, res) {
    var user = req.user.id;

    db.deal.find({
      seller: user
    }, function(err, deals) {
      if (err) {
        res.jsonp({
          error: "Error retreiving seller's deals from the database"
        })
      } else {
        res.jsonp(deals);
      }
    });
  }
}

/*
	Verify that Offer exist
	Seller has valid # of products.
*/
function isOfferValid(offer_id, callback) {
  db.offer.findOne({
    _id: ObjectID(offer_id)
  }, function(err, offer) {
    if (err) {
      return false;
    } else {
      var upc = offer.upc;
      var seller = offer.seller;
      var num_prod = offer.num_prod;
      var inventory = offer.inventory;

      db.product.findOne({
        product: upc
        , user: seller
      }, function(err, result) {
        if (err) {
          return false;
        } else {
          callback(parseInt(result.qty) - parseInt(num_prod) >= parseInt(inventory));
        }
      });
    }
  });
}

/*
	Verify that Deal exist.
	# of participants is valid.
	Hasn't expire.
*/
function isDealActive(id, user, callback) {
  db.deal.findOne({
    _id: ObjectID(id)
  }, function(err, $deal) {
    var bool = true;
    if ($deal.commiter.length >= $deal.total) bool = false;
    if ($deal.timeLeft < new Date()) bool = false; //invalid time
    if ($deal.seller == user) bool = false; //
    callback(bool);
  });
}