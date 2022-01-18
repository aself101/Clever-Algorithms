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
  Stoachistic: adaptive_random_search.js
**/
const randomInBounds = ({ min, max }) => {
  return min + ((max - min) * Math.random())
}

/**
* oneMax: Sums vals if array is 1
* @param {Array} vector: Array of misc 0,1 values
* @returns {Number} Sum from array of misc 0,1 values
* @called Stoachistic: [stochastic_hill_climbing.js]
**/
const oneMax = (vector) => {
  return vector.reduce((acc, cur, i) => {
    return acc + (cur === '1' ? 1 : 0)
  },0)
}

/**
* randomBitstring: Generates a bitstring of random values 0, 1
* @param {Number} numBits: Length of bitstring
* @returns {Array} Random 1D bitstring 0,1
* @called Stoachistic: [stochastic_hill_climbing.js]
**/
const randomBitstring = (numBits) => {
  return new Array(numBits).fill('0').map((a,i) => {
    if (Math.random() < 0.5) return '1'
    return a
  })
}

/**
* randomInteger: Generates a random number between 1...n
* @param {Number} n: number max
* @returns {Number} Random number between 1...n
* @called Stoachistic: [stochastic_hill_climbing.js]
**/
const randomInteger = (n) => {
  return Math.floor(Math.random() * n)
}

module.exports = {
  objectiveFunction,
  oneMax,
  randomBitstring,
  randomInBounds,
  randomInteger,
  randomVector
}




/* END */
