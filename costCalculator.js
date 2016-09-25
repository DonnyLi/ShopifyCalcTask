/** This program calculates how much it will cost to buy everything in the given categories **/

var request = require("request");
var async = require("async");

var productTypes = ["Clock", "Watch"];
var totalCost = 0.0;
var tax = 1.13; // Tax multiplier; ASSUMING ONTARIO

// Hardcoded links, I'm sorry :'(
var productPages = [
	"http://shopicruit.myshopify.com/products.json?page=1",
	"http://shopicruit.myshopify.com/products.json?page=2",
	"http://shopicruit.myshopify.com/products.json?page=3",
	"http://shopicruit.myshopify.com/products.json?page=4",
	"http://shopicruit.myshopify.com/products.json?page=5",
];

// Collect the results from the pages into one array
async.map(productPages, getJSON, function (err, res){
	if (err) {
		return console.log(err);
	}

  	totalCost = getTotalCost(res, productTypes);
  	console.log(totalCost);
});

/***************** HELPER FUNCTIONS *****************/

// Get JSON from a page given the url
function getJSON(url, callback) {
  	var options = {
	    url :  url,
	    json : true
	  };
	request(options,
		function(err, res, body) {
			callback(err, body);
		}
	);
}

/* 
	Returns the total cost of all the products that falls under productTypes.
	This currently doesn't factor in shipping cost
*/
function getTotalCost(shopifyProducts, productTypes) {
	var cost = 0.0;
	var itemPrice;
	for (var i = 0; i < shopifyProducts.length; i++) {
  		for (var j = 0; j < shopifyProducts[i].products.length; j++) {
  			if (productTypes.indexOf(shopifyProducts[i].products[j].product_type) > -1) {
  				for (var k = 0; k < shopifyProducts[i].products[j].variants.length; k++) {
  					var item = shopifyProducts[i].products[j].variants[k];
  					if (item.available) {
  						if (item.taxable) {
  							cost += parseFloat(item.price) * tax;
  						} else {
  							cost += parseFloat(item.price);
  						}
  					}
  				}
  			}
  		}
  	}
  	return cost;
}