var express = require('express');
var router = express.Router();

var yahoo = require('../services/y-finance.js');

/* GET home page. */
router.get('/', function (req, res, next) {

   res.render('index', {
      title: 'Express + D3',
      data: yahoo.getSavedStockNames()
   });
});

// router.get('/stocks', function (req, res, next) {
//    res.json(stocks.formatStockData());
// });

router.post('/add', function (req, res, next) {
   const symbol = req.body.symbol;
   console.log(symbol);

   yahoo.getOneStockBySymbol(symbol)
      .then(data => {
         yahoo.storeStocksLocally(data);

         res.send('Added successfully');
      })
});

router.delete('/remove', function(req, res, next) {
   const symbol = req.body.symbol;
   // console.log(symbol);

   yahoo.removeStock(symbol)

   res.send('Removed stock successfully');   
})

module.exports = router;
