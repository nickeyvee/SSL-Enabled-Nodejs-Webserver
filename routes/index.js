var express = require('express');
var router = express.Router();

var stocks = require('../services/stockinfo.js');

/* GET home page. */
router.get('/', function (req, res, next) {

   const symbols = stocks.formatStockData()
      .map(data => data);

   res.render('index', {
      title: 'Express + D3',
      data: symbols
   });
});

router.get('/stocks', function (req, res, next) {
   res.json(stocks.formatStockData());
});

router.post('/add', function (req, res, next) {
   const symbol = req.body.symbol;
   console.log(symbol);

   stocks.getOneStockBySymbol(symbol)
      .then(data => {
         stocks.storeStocksLocally(data);

         const symbols = stocks.formatStockData()
            .map(data => data);

         res.render('index', {
            title: 'Express + D3',
            data: symbols
         });
      })
});

module.exports = router;
