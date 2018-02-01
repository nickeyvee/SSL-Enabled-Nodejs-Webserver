var express = require('express');
var router = express.Router();
var fs = require('fs');

var yahoo = require('../services/finance.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	
	if (process.env.API_MODE) {
		res.redirect('/data');
	} else {
		res.render('index', {
			title: 'Express + C3',
			data: yahoo.getSavedStockNames()
		});
	}
});

module.exports = router;
