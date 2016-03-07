# distanceMatrix

Calculate distance matrix

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** options
    -   `options.points` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 
    -   `options.osrmPath` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.taskCallback` **taskCallback** callback
    -   `options.chunkSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of points in chunk
    -   `options.flow` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** flow type (either `series` or `parallel` as in
        [async](https://github.com/caolan/async))
-   `callback` **finalCallback** to be called when the matrices calculation
    is complete, with (error, result) arguments

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** calls callback

# finalCallback

This callback is called after all taskCallback is completed

**Parameters**

-   `error` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** any error thrown
-   `results` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** results of calling taskCallback on every chunk

# Row

Distance matrix row

**Properties**

-   `sourceId` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** source point id from original points array
-   `destinationId` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** destination point id from original points array
-   `sourceCoordinate` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** `[lat, lon]` pair of the snapped coordinate
-   `destinationCoordinate` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** `[lat, lon]` pair of the snapped coordinate
-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** travel time from the sourceCoordinates to
    destinationCoordinates. Values are given in 10th of a second.

# taskCallback

This callback is called with every distance matrix chunk

**Parameters**

-   `matrix` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;Row>** distance matrix chunk
-   `callback` **finalCallback** 

Returns **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)** calls callback
