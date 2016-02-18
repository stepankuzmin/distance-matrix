var turf = require('turf')
var minimist = require('minimist')
var distance_matrix = require('./distance-matrix')

var dbconfig = require('./db/config.js')
var knex = require('knex')(dbconfig.development)

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

console.time('foot_grid')
var points = []
var gridInserts = []
var hexGrid = turf.hexGrid(bbox, cellWidth, units)

hexGrid.features.forEach(function (feature, index) {
  var centroid = turf.centroid(feature)
  var coordinates = centroid.geometry.coordinates
  gridInserts.push({
    id: index,
    cell: knex.raw("ST_SetSRID(ST_GeomFromGeoJSON('"+JSON.stringify(feature.geometry)+"'), 4326)"),
    centroid: knex.raw("ST_GeomFromText('POINT("+coordinates[1]+" "+coordinates[0]+")', 4326)")
  })
  points.push([coordinates[1], coordinates[0]])
})

knex.raw(knex('foot_grid').insert(gridInserts).toString()).then(function() {
  console.timeEnd('foot_grid')

  distance_matrix({
    knex: knex,
    points: points,
    chunkSize: 500,
    osrm_path: osrm_path
  })
}).catch(function(error) {
  throw error
})
