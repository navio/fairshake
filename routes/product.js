module.exports = {
	
	search : function (req, res) {
		var upc = req.params.upc;
		var upcSearch = require(__dirname + '/../libs/upcModule.js');

		upcSearch(prodAdv, upc, function(result) {
			if(result.Items.Request.Errors){
				console.log(result.Items.Request.Errors);
				res.jsonp({'error':"Invalid UPC"});
			}
			else{
				var items = result.Items.Item;
				if(!items.length) {
					res.jsonp(items);
					return;
				}
				for(var i = 0; i < items.length; i++) {
					if(items[i].LargeImage) {
						res.jsonp(items[i]);
						break;
					}
				}	
			}
		});
	},

	getTopSellers : function(req, res) {
		var topSellers = require(__dirname + '/../libs/topSellers.js');

		topSellers(prodAdv, function(result) {
			res.jsonp(result.Items.Item);
		});
	},
	
	
	sendBid: function(req, res){
		var qty = req.params.qty;
			upc = req.params.upc;
			user = req.user.id;
			bid = req.params.bid;
			
			var query_deals = "this.commiter.length >= "+ qty +" && this.upc == '"+ upc +"' &&  "+ bid +" < this.price * 1.05 && " + bid +" > this.price *.95"; 
			
			var query_offers = "this.num_prod >= "+ qty +" && this.upc == '"+ upc +"' &&  "+ bid +" < this.price * 1.05 && " + bid +" > this.price *.95";
	
			db.deal.find({ $where: query_deals },function(err,_deals){ 
					
				if(err){ res.jsonp({error:"Problem with query"}); return 1; }
				
				db.offer.find({ $where: query_offers}, function(req,_offers){
					
					res.jsonp({deal:_deals,offer:_offers});
					
				});
					
			});
			
			
	}
}