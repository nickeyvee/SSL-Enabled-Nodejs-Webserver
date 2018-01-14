'use strict';
const fs = require('fs');
const util = require('util');
const expect = require('chai').expect;

// JSON object for unit tests.
let mock;

describe('helpers.js', function () {
   const helper = require('../src/helpers.js');

   it('should exist', function () {
      expect(helper).to.exist;
   })
});

const helper = require('../src/helpers.js');
