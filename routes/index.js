var express = require('express');
var router = express.Router();
var fs = require('fs');

var yahoo = require('../services/finance.js');

/* GET home page. */
router.get('/', function (req, res, next) {

   res.render('index', {
      title: 'Express + D3',
      data: yahoo.getSavedStockNames()
   });
});

router.get('/stocks', function (req, res, next) {
   const mappedData = yahoo.mapStocksByDateAndPrice(yahoo.localStockData);

   // PRODUCE A JSON DOC FOR TESTS.
   // const json = JSON.stringify(mappedData);
   // fs.writeFile('./tests/mocks/mockfile.json', json, 'utf8');

   res.json(mappedData);
});

router.post('/add', function (req, res, next) {
   const symbol = req.body.symbol;
   // console.log(symbol);

   yahoo.getOneStockBySymbol(symbol)
      .then(data => {
         yahoo.storeStocksLocally(data);

         res.json(
            yahoo.mapStocksByDateAndPrice(
               yahoo.localStockData
            )
         );
      })
});

router.delete('/remove', function (req, res, next) {
   const symbol = req.body.symbol;
   // console.log(symbol);
   yahoo.removeStock(symbol)

   res.json(
      yahoo.mapStocksByDateAndPrice(
         yahoo.localStockData
      )
   )
})

router.post('/timescale', function (req, res, next) {
      const symbol = req.body.symbol;
      const range = req.body.range;
      console.log(symbol, range);
   
      yahoo.getOneStockBySymbol(symbol, range)
         .then(data => {
            console.log(data);
            yahoo.storeStocksLocally(data);
   
            res.json(
               yahoo.mapStocksByDateAndPrice(
                  yahoo.localStockData
               )
            );
         })
   });

module.exports = router;
