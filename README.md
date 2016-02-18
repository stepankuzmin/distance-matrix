# OSRM distance matrix

Calculates arbitrary size distance matrix using The Open Source Routing Machine

## Installation

```shell
git clone https://github.com/stepankuzmin/distance-matrix.git
cd distance-matrix
npm install
```

## Usage

Set up database connection in `db/config.js`, then run migrations

```shell
npm run db:migrate
```

Calculate distance matrix with

```shell
node --max_old_space_size=4096 index.js moscow.osrm
```
