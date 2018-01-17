var express = require('express');
var router = express.Router();
var fs = require('fs');

var yahoo = require('../services/finance.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(yahoo.getSavedStockNames());

	res.render('index', {
		title: 'Express + C3',
		data: yahoo.getSavedStockNames()
	});
});

router.get('/stocks', function (req, res, next) {

	// PRODUCE A JSON DOC FOR TESTS.
	// const json = JSON.stringify(yahoo.localStockData);
	// fs.writeFile('./tests/mocks/mockfile-12-month.json', json, 'utf8');

	res.json(yahoo.localStockData);
});

router.post('/add', function (req, res, next) {
	const symbol = req.body.symbol;
	const range = req.body.range;	

	yahoo.getOneStockBySymbol(symbol, range)
		.then(data => {
			yahoo.storeStocksLocally(data);

			res.json(yahoo.localStockData);
		})
});

router.delete('/remove', function (req, res, next) {
	const symbol = req.body.symbol;
	yahoo.removeStock(symbol)

	res.json(yahoo.localStockData);
})

router.post('/timescale', function (req, res, next) {
	const symbol = req.body.symbol;
	const range = req.body.range;

	const stockNames = yahoo.getSavedStockNames()
		.map(d => d.symbol);
		console.log(stockNames)

	yahoo.removeAll();

	yahoo.getStocksBySymbol(stockNames, range)
		.then(data => {
			yahoo.storeStocksLocally(data);
			res.json(yahoo.localStockData);
		})
});

module.exports = router;
