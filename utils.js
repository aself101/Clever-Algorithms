/*
  General utility functions used throughout the packages
*/

/**
* objectiveFunction: Returns values squared
* @param {Array} vector: Array of misc values
* @returns {Number} Sum from array of misc values run through Math.pow(val, 2)
* @called Stoachistic: [random_search.js]
**/
const objectiveFunction = (vector) => {
  return vector.reduce((acc, cur, i) => {
    return acc + (Math.pow(cur, 2.0))
  },0)
}

/**
* randomVector: Generates a vector of random values from a mix max 2d array
* @param {Array} minmax: 2D vector of min-max values; i.e [-5,5]
* @returns {Array} Random 1D vector of misc values
* @called Stoachistic: [random_search.js]
**/
const randomVector = (minmax) => {
  return new Array(minmax.length).fill(0).map((a,i) => {
    return randomInBounds({ min: minmax[i][0], max: minmax[i][1] })
  })
}

/**
* randomInBounds: Generates a random value in the bounds of a min and max
* @param {Number} min: min value of a minmax
* @param {Number} max: max value of a minmax
* @returns {Number} Random value from minmax
* @called randomVector()
**/
const randomInBounds = ({ min, max }) => {
  return min + ((max - min) * Math.random())
}

module.exports = {
  objectiveFunction,
  randomInBounds,
  randomVector
}






















/* END */
