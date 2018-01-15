'use strict';

module.exports = (function () {

   /**
    * mapDataByTickerName() will make sure the data from our server is
    * consumable by the D3.js API.
    */

   function getDataByTickerName(data, symbol) {

      /**
       * 1) return the stock we are looking for
       * 2) map it's data and return it
       */
      const stock_data = data.find(stock => stock.symbol === symbol);

      const data_all = stock_data.data.map(d => d);

      const date_ISO = stock_data.data.map(d => d.ISO),
         date_left = date_ISO[date_ISO.length - 1],
         date_right = date_ISO[0],

         price_arr = stock_data.data.map(stock => stock.price),
         price_top = Math.max.apply(Math, price_arr),
         price_bottom = Math.min.apply(Math, price_arr);

      return {
         "data_all": data_all,
         "date_left": date_left,
         "date_right": date_right,
         "price_arr": price_arr,
         "price_top": price_top,
         "price_bottom": price_bottom
      }
   }

   return {
      "mapData": getDataByTickerName
   }
}());