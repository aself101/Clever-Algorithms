/*
  General utility functions used throughout the packages
*/

const BERLIN_52 = [[565,575],[25,185],[345,750],[945,685],[845,655],
[880,660],[25,230],[525,1000],[580,1175],[650,1130],[1605,620],
[1220,580],[1465,200],[1530,5],[845,680],[725,370],[145,665],
[415,635],[510,875],[560,365],[300,465],[520,585],[480,415],
[835,625],[975,580],[1215,245],[1320,315],[1250,400],[660,180],
[410,250],[420,555],[575,665],[1150,1160],[700,580],[685,595],
[685,610],[770,610],[795,645],[720,635],[760,650],[475,960],
[95,260],[875,920],[700,500],[555,815],[830,485],[1170,65],
[830,610],[605,625],[595,360],[1340,725],[1740,245]]

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
  return Math.round(Math.random() * n)
}

/**
* euclid2D: Euclidean distance calculation
* @param {Array} c1: 1D array of a location
* @param {Array} c2: 1D array of a location
* @returns {Number} Distance between two locations
* @called Stoachistic: [stochastic_hill_climbing.js]
**/
const euclid2D = ({ c1, c2 }) => {
  return Math.round(Math.sqrt(
    Math.pow(c1[0]-c2[0], 2) + Math.pow(c1[1]-c2[1], 2)
  ))
}

/**
* randomPermutation: Generates a random permutation of indexes
* @param {Array} cities: 2D array of all available cities
* @returns {Array} 1D array of random indexes
* @called
**/
const randomPermutation = (cities) => {
  try {
    let perm = new Array(cities.length).fill(0).map((a,i) => i)
    return perm.map((a,i,p) => {
      let r = randomInteger(perm.length-1 - i) + i
      a = p[r]
      p[r] = p[i]
      return a
    })
  } catch (e) {
    throw new Error(`Random permutation: ${e}`)
  }
}


module.exports = {
  BERLIN_52,
  euclid2D,
  objectiveFunction,
  oneMax,
  randomBitstring,
  randomInBounds,
  randomInteger,
  randomPermutation,
  randomVector
}




/* END */
