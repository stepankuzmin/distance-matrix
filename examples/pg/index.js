'use strict';

var turf = require('turf');
var distanceMatrix = require('../../index');

var dbconfig = require('./db/config.js');
var knex = require('knex')(dbconfig.development);

var centroid, coordinates,
  matrixInsertQueries = [],
  gridCellInsertQueries = [];

var hexGrid = turf.hexGrid([13.283, 52.456, 13.496, 52.566], 1, 'kilometers');

var points = hexGrid.features.map(function (feature, index) {
  centroid = turf.centroid(feature);
  coordinates = centroid.geometry.coordinates;

  gridCellInsertQueries.push({
    id: index,
    cell: knex.raw('ST_SetSRID(ST_GeomFromGeoJSON(\'' + JSON.stringify(feature.geometry) + '\'), 4326)'),
    centroid: knex.raw('ST_GeomFromText(\'POINT(' + coordinates[1] + ' ' + coordinates[0] + ')\', 4326)')
  });

  return [coordinates[1], coordinates[0]];
});

function taskCallback(matrix, callback) {
  matrixInsertQueries = matrix.map(function (row) {
    return {
      'source_id': row.sourceId,
      'destination_id': row.destinationId,
      'time': row.time
    };
  });

  knex.raw(knex('foot_matrix').insert(matrixInsertQueries).toString()).then(function () {
    callback(null, 'ok');
  }).catch(function (error) {
    callback(error);
  });
}

var options = {
  flow: 'parallel',
  points: points,
  chunkSize: 50,
  taskCallback: taskCallback,
  osrmPath: '../../test/data/berlin-latest.osrm'
};

function finalCallback() {
  console.log('finalCallback');
  distanceMatrix(options, function callback(error) {
    if (error) {
      throw error;
    }
    knex.destroy(function () {});
  });
}

// Run
knex.raw(knex('foot_grid')
    .insert(gridCellInsertQueries).toString())
    .then(finalCallback);
