'use strict';

var turf = require('turf');
var path = require('path');
var distanceMatrix = require('../../index');

var centroid, coordinates;

var points = turf.random('points', 10, {
  bbox: [13.283, 52.456, 13.496, 52.566]
}).features.map(function (feature) {
  centroid = turf.centroid(feature);
  coordinates = centroid.geometry.coordinates;
  return [coordinates[1], coordinates[0]];
});

process.stdout.write('srcId\tdstId\ttime\n');

function taskCallback(matrix, callback) {
  matrix.forEach(function (row) {
    process.stdout.write(row.sourceId + '\t' + row.destinationId + '\t' + row.time + '\n');
  });
  callback(null);
}

var osrmPath = path.join(__dirname, '../../node_modules/osrm/test/data/berlin-latest.osrm');

var options = {
  flow: 'parallel',
  points: points,
  chunkSize: 5,
  taskCallback: taskCallback,
  osrmPath: osrmPath
};


distanceMatrix(options, function callback(error) {
  if (error) {
    throw error;
  }
});
