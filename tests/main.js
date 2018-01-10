'use strict';
const util = require('util');
const expect = require('chai').expect;
// How to run Mocha tests located in multiple files solution via stack overflow..
// https://stackoverflow.com/questions/24153261/joining-tests-from-multiple-files-with-mocha-js

function importTest(name, path) {
   describe(name, function () {
      require(path);
   });
}

// a file that deoPn't exist..yet.
// This is where you can put common modules
// that are used in your tests :

// var common = require("./common");

describe("test entry point (main.js)\n", function () {
   beforeEach(function () {
      // console.log("running something before each test");
   });

   // importTest("Alphavantage data service\n", './stockinfo.spec.js');
   importTest("Yahoo Finance Service\n", './y-finance.spec.js');

   after(function () {
      //  process.exit();
   });
});