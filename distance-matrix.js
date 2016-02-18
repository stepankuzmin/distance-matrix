var R = require('ramda')
var OSRM = require('osrm')
var async = require('async')

module.exports = function distance_matrix(opts) {
  var knex = opts.knex
  var points = opts.points
  var chunkSize = opts.chunkSize
  var osrm_path = opts.osrm_path

  var ids = R.range(0, points.length)
  var xprod = R.compose(R.converge(R.xprod, [R.identity, R.identity]), R.splitEvery(chunkSize))

  var combinations = xprod(ids)
  var osrm = new OSRM(osrm_path)

  var options = {}
  var matrixInserts = []
  var sourceId, destinationId

  var tasks = combinations.map(function createTask(combination) {
    options = {
      sources: combination[0].map(function (id) { return points[id]}),
      destinations: combination[1].map(function (id) { return points[id]})
    }

    matrixInserts = []
    return function task(callback) {
      osrm.table(options, function(error, table) {
        if (error) {
          callback(error)
        } else {
          for (srcIndex = 0; srcIndex < table.source_coordinates.length; srcIndex++) {
            for (dstIndex = 0; dstIndex < table.destination_coordinates.length; dstIndex++) {
              sourceId = combination[0][srcIndex]
              destinationId = combination[1][dstIndex]
              if (sourceId != destinationId) {
                time = table.distance_table[srcIndex][dstIndex]/600
                matrixInserts.push({
                  source_id: sourceId,
                  destination_id: destinationId,
                  time: time
                })
              }
            }
          }

          knex.raw(knex('foot_matrix').insert(matrixInserts).toString()).then(function (rows) {
            callback(null, 'ok')
          }).catch(function (error) {
            callback(error)
          })
        }
      })
    }
  })

  console.time('foot_matrix')
  async.series(tasks, function process(error, results) {
    if (error) {
      throw error
    }

    console.timeEnd('foot_matrix')
    knex.destroy(function() {
      console.log('Done!')
    })
  })
}
