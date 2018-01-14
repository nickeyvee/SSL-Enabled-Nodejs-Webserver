'use strict';

function searchByTickerName(dataArr, symbol) {
   return dataArr.find(stock => stock.symbol === symbol);
}

/**
 * mapStockData() will make sure the data from our server is
 * consumable by the D3.js API.
 */

function mapStockData(res) {

   const date_arr = res.data.map(stock => stock),
      date_left = res.data[res.data.length - 1],
      date_right = res.data[0],

      price_arr = res.data.map(stock => stock.price),
      price_top = Math.max.apply(Math, price_arr),
      price_bottom = Math.min.apply(Math, price_arr);

   return {
      "date_arr": date_arr,
      "date_left": date_left,
      "date_right": date_right,
      "price_arr": price_arr,
      "price_top": price_top,
      "price_bottom": price_bottom
   }
}

module.exports = {
   searchByTickerName,
   mapStockData
}