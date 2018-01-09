var express = require('express');
var router = express.Router();

var stocks = require('../services/stockinfo.js');

/* GET home page. */
router.get('/', function (req, res, next) {
   const info = stocks.localStockData.map(data => data['Meta Data']);

   console.log(info);

   res.render('index', { title: 'Express' });
});

module.exports = router;
