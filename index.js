'use strict';

var R = require('ramda');
var OSRM = require('osrm');
var async = require('async');

/**
 * Calculate distance matrix
 *
 * @alias distanceMatrix
 * @param {Object} options options
 * @param {Array.<string>} options.points
 * @param {string} options.osrmPath
 * @param {taskCallback} options.taskCallback callback
 * @param {number} options.chunkSize number of points in chunk
 * @param {string} options.flow flow type (either `series` or `parallel` as in
 * [async](https://github.com/caolan/async))
 * @param {finalCallback} callback to be called when the matrices calculation
 * is complete, with (error, result) arguments
 * @returns {undefined} calls callback
 */
module.exports = function distanceMatrix(options, callback) {
  var points = options.points;
  var chunkSize = options.chunkSize || points.length;
  var osrmPath = options.osrmPath;
  var flow = options.flow || 'series';

  /**
    * This callback is called with every distance matrix chunk
    *
    * @callback taskCallback
    * @param {Array<Row>} matrix distance matrix chunk
    * @param {finalCallback} callback
    * @returns {undefined} calls callback
    */
  var taskCallback = options.taskCallback || function taskCallback(matrix, callback) {
    callback(null, matrix);
  };

  // xprod of point ids
  var xprod = R.compose(
    R.converge(R.xprod, [R.identity, R.identity]),
    R.splitEvery(chunkSize),
    R.range(0),
    R.length
  );

  var combinations = xprod(points);
  var osrm = new OSRM(osrmPath);

  var matrix = [];
  var sources, destinations, srcIndex, dstIndex, sourceId, destinationId;
  var tasks = combinations.map(function createTask(combination) {
    sources = combination[0].map(function (id) { return points[id]; });
    destinations = combination[1].map(function (id) { return points[id]; });
    return function task(callback) {
      osrm.table({sources: sources, destinations: destinations}, function (error, table) {
        if (error) {
          callback(error);
        } else {
          matrix = [];
          for (srcIndex = 0; srcIndex < table.source_coordinates.length; srcIndex++) {
            for (dstIndex = 0; dstIndex < table.destination_coordinates.length; dstIndex++) {
              sourceId = combination[0][srcIndex];
              destinationId = combination[1][dstIndex];
              if (sourceId !== destinationId) {
                /**
                 * Distance matrix row
                 * @typedef {Object} Row
                 * @property {number} sourceId - source point id from original points array
                 * @property {number} destinationId - destination point id from original points array
                 * @property {Array.<number>} sourceCoordinate - `[lat, lon]` pair of the snapped coordinate
                 * @property {Array.<number>} destinationCoordinate - `[lat, lon]` pair of the snapped coordinate
                 * @property {number} time - travel time from the sourceCoordinates to
                 * destinationCoordinates. Values are given in 10th of a second.
                 */
                matrix.push({
                  sourceId: sourceId,
                  destinationId: destinationId,
                  sourceCoordinate: table.source_coordinates[srcIndex],
                  destinationCoordinate: table.destination_coordinates[dstIndex],
                  time: table.distance_table[srcIndex][dstIndex]
                });
              }
            }
          }
          taskCallback(matrix, callback);
        }
      });
    };
  });

  switch (flow) {
  case 'series':
    async.series(tasks, callback);
    break;
  case 'parallel':
    async.parallel(tasks, callback);
    break;
  default:
    async.series(tasks, callback);
  }
};

/**
 * This callback is called after all taskCallback is completed
 *
 * @callback finalCallback
 * @param {Object} error any error thrown
 * @param {Array} results results of calling taskCallback on every chunk
 */
