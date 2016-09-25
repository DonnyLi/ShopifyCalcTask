/**
This program calculates how much it will cost to buy everything in the given categories.
Does everything asynchronously and also determines when to stop reading the pages dynamically.
**/

var request = require("request");
var async = require("async");

var productTypes = ["Clock", "Watch"];
var pageNum = 1;
var totalCost = 0.0;
var shopifyProducts = [];
var tax = 1.00; // Tax multiplier; currently set to do nothing

var productPage = "http://shopicruit.myshopify.com/products.json?page=";

getJSON(productPage + pageNum, callbackHandler);

/***************** HELPER FUNCTIONS *****************/

// Determines what to do next given the JSON body
function callbackHandler(err, body) {
	if (err) {
		return console.error(err);
	} else {
		console.log("Successfully read page " + pageNum);
	}

	if (body.products.length === 0) {
		totalCost = getTotalCost(shopifyProducts, productTypes);
		console.log("Total cost is: " + totalCost);
	} else {
		pageNum++;
		shopifyProducts.push(body);
		getJSON(productPage + pageNum, callbackHandler);
	}
}

// Get JSON from a page given the url and calls upon a callback handler to determine the next step
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