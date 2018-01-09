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

// a file that deosn't exist..yet.
// This is where you can put common modules
// that are used in your tests :

// var common = require("./common");

describe("test entry point (top.js)", function () {
   beforeEach(function () {
      console.log("running something before each test");
   });

   // importTest("unit tests...", './path-to-spec.js');
   // importTest("more unit tests...", './path-to-spec.js');

   after(function () {
      //  process.exit();
   });
});