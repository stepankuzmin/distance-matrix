var fs = require('fs')
var async = require('async')
var OSRM = require('osrm')
var Combinatorics = require('js-combinatorics')

// compare arrays
function eq(a1, a2) {
 return (a1.length == a2.length) && a1.every(function(element, index) {
    return element === a2[index]
 })
}

var matrixStream = fs.createWriteStream('matrix.tsv')
matrixStream.write('source\tdestination\ttime\n')

module.exports = function calculate(osrm_path, points) {
  console.log('points.length', points.length)

  console.time('calculate')
  var osrm = new OSRM(osrm_path)
  var combinations = Combinatorics.combination(points, 500)

  var row
  var matrix = []
  var source, destination, options

  var tasks = combinations.toArray().map(function createTask(combination) {
    return function task(callback) {
      options = { coordinates: combination }
      osrm.table(options, function(error, table) {
        if (error) {
          callback(error)
        } else {
          for (i = 0; i < table.source_coordinates.length; i++) {
            for (j = 0; j < table.destination_coordinates.length; j++) {
              source = table.source_coordinates[i]
              destination = table.destination_coordinates[j]
              time = table.distance_table[i][j]/600
              if (!eq(source, destination)) {
                row = source + '\t' + destination + '\t' + time + '\n'
                matrix.push([source, destination, time])
                matrixStream.write(row)
                process.stdout.write(row)
              }
            }
          }
          callback(null, matrix)
        }
      })
    }
  })

  async.series(tasks, function process(error, results) {
    matrixStream.end()

    if (error) {
      console.error('Error: ', error)
      return -1
    }

    console.timeEnd('calculate')

    // var matrix = [].concat.apply([], results)
    // console.log('Results', JSON.stringify(matrix, null, 2))
  })
}
