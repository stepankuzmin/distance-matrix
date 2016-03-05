'use strict';

var turf = require('turf');
var distanceMatrix = require('../../index');

var centroid, coordinates;

var points = turf.random('points', 10, {
  bbox: [37.606, 55.731, 37.640, 55.752]
}).features.map(function (feature) {
  centroid = turf.centroid(feature);
  coordinates = centroid.geometry.coordinates;
  return [coordinates[1], coordinates[0]];
});

function taskCallback(matrix, callback) {
  matrix.forEach(function (row) {
    process.stdout.write(row[0] + '\t' + row[1] + '\t' + row[2] + '\n');
  });
  callback(null);
}

var options = {
  flow: 'parallel',
  points: points,
  chunkSize: 5,
  taskCallback: taskCallback,
  osrmPath: '/Users/stepan/Documents/projects/osrm-backend/build/moscow_russia.osrm'
};

process.stdout.write('srcId\tdstId\ttime\n');

distanceMatrix(options, function callback(error) {
  if (error) {
    throw error;
  }
});
