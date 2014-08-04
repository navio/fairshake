module.exports = {

	addOffer : function (req, res) {

		var upc = req.body.upc,
		run_time = req.body.run_time || 1440,
		price = req.body.price,
		num_prod = req.body.num_prod,
		inventory = req.body.inventory,
		seller = req.user.id;
		
		db.offer.insert({upc:upc,run_time:run_time,price:price,num_prod:num_prod,inventory:inventory,seller:seller},function(err,data){
			if(err) {
				console.log('Error',err);
				res.jsonp({error:'Error adding offer to DB'})
			}else{
				console.log('Adding offer to DB');
				res.jsonp({success:"Offer was successfully added to the DB"});
			}
		});	
	},

	getOffer : function (req, res) {
		var offer_id = req.params.id;
		
		db.offer.findOne({_id:ObjectID(offer_id)}, function(err, offer) {
			if(err) {
				res.jsonp({error:"No existance of this offer in the DB"});
			}else{
				res.jsonp(offer);
			}
		});
	},

	updateOffer : function (req, res) {
		var upc = req.params.upc,
		run_time = req.params.run_time || 86400,
		price = req.params.price,
		num_prod = req.params.products,
		inventory = req.params.inventory,
		seller = req.user.id,
		offer_id = req.params.id;

		db.deal.findOne({offer:ObjectID(offer_id)}, function(err, deal) {
			if(deal) {
				console.log(deal);
				res.jsonp({error:"Deal based on this offer already exists, update failed"});
			}else{
				db.offer.update({_id:ObjectID(offer_id)}, {$set: {upc:upc,run_time:run_time,price:price,num_prod:num_prod,inventory:inventory,seller:seller}}, function(err, result) {
					if(err){
						res.jsonp({error:"Update failed"});
					}else{
						res.jsonp({success:"Offer was updated"});
					}
				});
			}
		});
	},

	deleteOffer : function (req, res) {
		var offer_id = req.params.id;

		db.offer.remove({_id:ObjectID(offer_id)}, function(err, result) {
			if(err) {
				res.jsonp({error: "Error deleting the offer"});
			}else{
				res.jsonp({success: "Offer "+offer_id+" was deleted"});
			}
		});
	},

	getOffers : function(req, res){
		var seller = req.user.id;

		db.offer.find({seller:seller}, function(err, offers) {
			if(err){
				res.jsonp({error: "Error getting all offers"});
			}else {
				res.jsonp(offers);
			}
		});
	},

	getOffersWithUPC : function(req, res){
		var upc = req.params.upc;
		var seller = req.user.id;
			
		db.offer.find({upc:upc,seller:seller}, function(err, offers) {
			if(err){
				res.jsonp({error: "Error getting all offers of this upc"});
			}else {
				res.jsonp(offers);
			}
		});
	}

}