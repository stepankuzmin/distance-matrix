'use strict';

var test = require('tape');
var path = require('path');
var distanceMatrix = require('../');

test('distance matrix', function (t) {
  t.plan(2);

  var points = [[52.517037, 13.388860], [52.51879, 13.40094]];
  var osrmPath = path.join(__dirname, '../node_modules/osrm/test/data/berlin-latest.osrm');

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
