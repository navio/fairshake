/**
 * Calls to Amazon API to get top sellers 
 */
 
module.exports = function(prodAdv, callback) {
	// Special Product Groups
	var options = {BrowseNodeId: "172282,301668,1000", ResponseGroup: "TopSellers"};

	function innerCallback(err, result) {
		try{
			var browseNodes = result.BrowseNodes.BrowseNode;
			var asins = "";
			for(var i = 0; i < browseNodes.length; i++) {
				for(var j = 0; j < 3; j++) {
					asins += browseNodes[i].TopSellers.TopSeller[j].ASIN;
					if(!(i == browseNodes.length && j == 2)) {
						asins += ",";
					}
				}
			}
		}catch(err){
			console.log(err);
		}
		prodAdv.call("ItemLookup", {IdType: "ASIN", ItemId: asins, ResponseGroup: "ItemAttributes,Images"}, function(err, result) {
		  if(err)
		  	console.log(result.Items.Request.Errors);
		  callback(result);
		});
	}
	return prodAdv.call("BrowseNodeLookup", options, innerCallback);
}