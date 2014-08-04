/**
 * Calls to Amazon API to get product info throught upc
 */
 
module.exports = function (prodAdv, UPC, callback) {

	var options = {IdType: "UPC", ItemId: UPC, SearchIndex: "All", ResponseGroup: "ItemAttributes,Images,Offers"};

	return prodAdv.call("ItemLookup", options, function(err, result) {
	  if(err)
	  	console.log(result.Items.Request.Errors);
	  callback(result);
	});

};