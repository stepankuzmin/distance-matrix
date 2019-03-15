# OSRM distance matrix

[![Build Status](https://travis-ci.org/stepankuzmin/distance-matrix.svg?branch=master)](https://travis-ci.org/stepankuzmin/distance-matrix)
[![Greenkeeper badge](https://badges.greenkeeper.io/stepankuzmin/distance-matrix.svg)](https://greenkeeper.io/)

**Warning**: this is experimental.

Calculate large distance matrix using [The Open Source Routing Machine](http://project-osrm.org/)

## Installation

```shell
npm install distance-matrix
```

...or build from source

```shell
git clone https://github.com/stepankuzmin/distance-matrix.git
cd distance-matrix
npm install
```

## Build

An osrm file is required for routing. This can be generated using included binaries. (_Note: this will take a lot of processing power if you are planning to use the entire planet.osm file, for general use a regional OSM data extract is preferable. More info [here](https://github.com/Project-OSRM/osrm-backend/wiki/Running-OSRM)_)

```sh
# first download an osm file containing the area you need
./node_modules/distance-matrix/osrm/lib/binding/osrm-extract mydata.osm -p ./node_modules/distance-matrix/osrm/test/data/car.lua
./node_modules/distance-matrix/osrm/lib/binding/osrm-prepare mydata.osrm -p ./node_modules/distance-matrix/osrm/test/data/car.lua
```

## Usage

See the [API](https://github.com/stepankuzmin/distance-matrix/blob/master/docs/API.md), `examples/tsv/index.js` and `test/index.js` for examples of calculating large distance matrices.
