module.exports = {
	
	all : function(req,res){
		db.users.find(function(err, users) {
		  if(!err){
		    res.jsonp(users);  
		  }else{
		  	console.log('error:',err);
	  	  	res.send('error')
	  	  }
		  
		});
	}
	
}