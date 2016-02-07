var turf = require('turf')
var minimist = require('minimist')
var calculate = require('./distance-matrix')

// var bbox = [37.606,55.731,37.640,55.752],
var bbox = [37.35,55.56,37.87,55.94], // moscow
    cellWidth = 0.1,
    units = 'kilometers'

var config = minimist(process.argv.slice(2))
if (config.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

if (config._ < 1) {
  console.error('Error: OSRM file not specified')
  process.exit(-1)
}

var osrm_path = config._[0]

var hexGrid = turf.hexGrid(bbox, cellWidth, units)

var points = hexGrid.features.map(function (feature) {
  var centroid = turf.centroid(feature)
  var coordinates = centroid.geometry.coordinates
  return [coordinates[1], coordinates[0]]
})

calculate(osrm_path, points)
