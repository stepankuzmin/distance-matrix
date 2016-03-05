'use strict';

var test = require('tape');
var distanceMatrix = require('../');

test('distance matrix', function (t) {
  t.plan(2);

  var points = [[52.517037, 13.388860], [52.51879, 13.40094]];

  var options = {
    flow: 'parallel',
    points: points,
    osrmPath: 'test/data/berlin-latest.osrm'
  };

  distanceMatrix(options, function callback(error, matrix) {
    t.error(error, 'Could not compute distance matrix');
    t.ok(matrix, 'Computed distance matrix');
  });
});
