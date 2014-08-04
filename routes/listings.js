module.exports = {
	
	addProduct : function (req, res) {
		
		var upc = req.params.upc;
		var quantity = req.body.qty || 1;
		var user = req.user.id;
		db.product.find({product:upc,user:user}, insertProudct);
		
		function insertProudct(err1,docs){
			if(docs.length){ 
				res.jsonp({error:'This product already exist for the user.'})
			}else{				
				db.product.insert({user:user,product:upc,qty:parseInt(quantity),reserve:0},function(err,data){
					if(err) {
						res.jsonp({error:'Problem Adding product to DB.'})
					}else{
						res.jsonp({success:"Product was successfully added to the listing"});
					}
				});	
				
			}
		}
	},
	
	getProduct : function (req, res) {
		var upc = req.params.upc;
		db.product.findOne({product:upc,user:req.user.id}, function(err,doc){
			if(err) res.jsonp({error: 'No existance of this product among sellers.'});
			res.jsonp(doc);
		})
	},
	
	updateProduct : function (req, res) {
		
		var upc = req.params.upc;
		var user = req.user.id;
		var quantity = req.body.qty;
		
		if(quantity){ 
			db.product.update({product:upc, user:user}, {$set: {qty:quantity}}, function(err, doc, lastErrorObject){
				res.jsonp({success:"Product was succesfully updated."})
			});
		} else{
			res.jsonp({error: 'No quantity was provided.'});
		}
		
	},
	
	deleteProduct : function (req, res) {
		var upc = req.params.upc;
		db.product.remove({product:upc}, function(err,result){
			if(err){ 
					res.jsonp({error: 'There was an error removing this problem.'});
				}else{
					res.jsonp({succes: "Product "+upc+"was removed."});
				}
			
		});
	},
	
	getAllProducts : function(req,res){
		db.product.find({user:req.user.id},function(err,data){
			if(err){
				res.jsonp({error: 'There was an error retriving user products'});
			}else{
				res.jsonp(data);
			} 	
		});
	}
	
}