'use strict';

var test = require('tape');
var path = require('path');
var distanceMatrix = require('../');

test('distance matrix', function (t) {
  t.plan(2);

  var points = [[43.7311424, 7.4197576], [43.7311424, 7.4197576]];
  var osrmPath = path.join(__dirname, 'data', 'monaco.osrm');

  var options = {
    flow: 'parallel',
    points: points,
    osrmPath: osrmPath
  };

  distanceMatrix(options, function callback(error, matrix) {
    t.error(error, 'Could not compute distance matrix');
    t.ok(matrix, 'Computed distance matrix');
  });
});
