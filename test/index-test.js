var vows = require('vows');
var assert = require('assert');
var util = require('util');
var foodspotting = require('passport-foodspotting');


vows.describe('passport-foodspotting').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(foodspotting.version);
    },
  },
  
}).export(module);
