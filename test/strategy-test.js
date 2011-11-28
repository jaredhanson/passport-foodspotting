var vows = require('vows');
var assert = require('assert');
var util = require('util');
var FoodspottingStrategy = require('passport-foodspotting/strategy');


vows.describe('FoodspottingStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new FoodspottingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named foodspotting': function (strategy) {
      assert.equal(strategy.name, 'foodspotting');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new FoodspottingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        var body = '{ \
          "location": "Tokyo", \
          "reviews_count": 152, \
          "guides_count": 6, \
          "tips_count": 9295, \
          "recent_notifications_count": 0, \
          "noms_count": 13, \
          "notifications_count": 241, \
          "avatar": "http://s3.amazonaws.com/foodspotting-development-ec2/people/10/small_thumb.jpg?1254810254", \
          "followings_count": 31, \
          "name": "Kim Ahlstr\u00f6m", \
          "id": 10, \
          "wants_count": 214, \
          "sharing_available_for": { \
            "facebook": false, \
            "flickr": false, \
            "foursquare": false, \
            "twitter": false \
          } \
        }';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'foodspotting');
        assert.equal(profile.id, '10');
        assert.equal(profile.displayName, 'Kim Ahlström');
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new FoodspottingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
