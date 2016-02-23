var R = require('ramda')
var OSRM = require('osrm')
var async = require('async')

module.exports = function distance_matrix(options, callback) {
  var points = options.points
  var chunkSize = options.chunkSize
  var osrm_path = options.osrm_path
  var flow = options.flow || 'series'

  var taskCallback = options.taskCallback || function(matrix, callback) {
    callback(null, matrix)
  }

  // xprod of point ids
  var xprod = R.compose(
    R.converge(R.xprod, [R.identity, R.identity]),
    R.splitEvery(chunkSize),
    R.range(0),
    R.length
  )

  var combinations = xprod(points)
  var osrm = new OSRM(osrm_path)

  var matrix = []
  var sources, destinations, srcIndex, dstIndex, sourceId, destinationId
  var tasks = combinations.map(function (combination) {
    sources = combination[0].map(function (id) { return points[id] })
    destinations = combination[1].map(function (id) { return points[id] })
    return function task(callback) {
      osrm.table({ sources: sources, destinations: destinations }, function(error, table) {
        if (error) {
          callback(error)
        } else {
          matrix = []
          for (srcIndex = 0; srcIndex < table.source_coordinates.length; srcIndex++) {
            for (dstIndex = 0; dstIndex < table.destination_coordinates.length; dstIndex++) {
              sourceId = combination[0][srcIndex]
              destinationId = combination[1][dstIndex]
              if (sourceId != destinationId) {
                matrix.push([
                  sourceId,
                  destinationId,
                  table.distance_table[srcIndex][dstIndex]
                ])
              }
            }
          }
          taskCallback(matrix, callback)
        }
      })
    }
  })

  switch (flow) {
    case 'series':
      async.series(tasks, callback)
      break
    case 'parallel':
      async.parallel(tasks, callback)
      break
    default:
      async.series(tasks, callback)
  }
}
