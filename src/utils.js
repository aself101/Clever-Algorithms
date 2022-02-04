/*
  General utility functions used throughout the packages
*/

/**
* objectiveFunction: Cost function; Returns values squared
* @param {Array} vector: Array of misc values
* @returns {Number} Sum from array of misc values run through Math.pow(val, 2)
* @called Stochastic: [random_search.js, scatter_search.js]
          Evolutionary: [evolution_strategies.js, evolutionary_programming.js]
**/
const objectiveFunction = (vector) => {
  return vector.reduce((acc, cur, i) => {
    return acc + (Math.pow(cur, 2.0))
  },0)
}

/**
* randomVector: Generates a vector of random values from a min-max 2d array
* @param {Array} minmax: 2D vector of min-max values; i.e [-5,5]
* @returns {Array} Random 1D vector of misc values
* @called Stochastic: [random_search.js, scatter_search.js]
          Evolutionary: [evolution_strategies.js, evolutionary_programming.js]
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
          Stochastic: [adaptive_random_search.js, scatter_search.js]
**/
const randomInBounds = ({ min, max }) => {
  return min + ((max - min) * Math.random())
}

/**
* oneMax: Cost function; Sums vals if array is 1
* @param {Array} vector: Array of misc 0,1 values
* @returns {Number} Sum from array of misc 0,1 values
* @called Stochastic: [stochastic_hill_climbing.js]
          Evolutionary: [genetic_algorithm.js]
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
* @called Stochastic: [stochastic_hill_climbing.js]
          Evolutionary: [genetic_algorithm.js]
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
* @called Stochastic: [stochastic_hill_climbing.js, iterated_local_search.js,
          tabu_search.js, reactive_tabu_search.js, greedy_randomized_adaptive_search.js]
          Evolutionary: [genetic_algorithm.js]
**/
const randomInteger = (n) => {
  return Math.round(Math.random() * n)
}

/**
* euclid2D: Euclidean distance calculation
* @param {Array} c1: 1D array of a location(2 vals)
* @param {Array} c2: 1D array of a location(2 vals)
* @returns {Number} Distance between two locations
* @called stochastic: [guided_local_search.js, variable_neighborhood_search.js,
          iterated_local_search.js, greedy_randomized_adaptive_search.js,
          tabu_search.js, reactive_tabu_search.js]
**/
const euclid2D = ({ c1, c2 }) => {
  return Math.round(Math.sqrt(
    Math.pow(c1[0]-c2[0], 2) + Math.pow(c1[1]-c2[1], 2)
  ))
}
/**
* euclideanDistance: Euclidean distance calculation for n vars in a vector
* @param {Array} c1: 1D array of n values
* @param {Array} c2: 1D array of n values
* @returns {Number} Distance between two vectors
* @called stochastic: [scatter_search.js]
**/
const euclideanDistance = ({ c1, c2 }) => {
  try {
    let sum = 0
    c1.map((c,i) => {
      sum += Math.pow(c1[i]-c2[i], 2)
      return c
    })
    return Math.sqrt(sum)
  } catch (e) {
    throw new Error(`Euclidea distance: ${e}`)
  }
}

/**
* randomPermutation: Generates a random permutation of indexes
* @param {Array} cities: 2D array of all available cities
* @returns {Array} 1D array of random indexes
* @called stochastic: [guided_local_search.js, variable_neighborhood_search.js,
  iterated_local_search.js, tabu_search.js, reactive_tabu_search.js]
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

/**
* randomPerm: Generates a random permutation of values in an array
* @param {Array} arr: array of values
* @param {Number} size: size of the random array
* @returns {Array} 1D array of random values
* @called evolutionary: [GeneticAlgorithm.js]
**/
const randomPerm = ({ arr, size }) => {
  try {
    let randomVals = []
    arr.map((a,i,p) => {
      let r = randomInteger(arr.length-1 - i) + i
      a = p[r]
      p[r] = p[i]
      randomVals.push(a)
      return a
    })
    for (let i = 0; i < size - arr.length; i++) {
      let r = arr[randomInteger(arr.length-1)]
      randomVals.push(r)
    }
    return randomVals
  } catch (e) {
    throw new Error(`Random perm: ${e}`)
  }
}

/**
* stochasticTwoOpt: Generates a new random permutation
* @param {Array} permutation: permutation of random indexes
* @returns {Array} 1D array of random indexes
* @called stochastic: [guided_local_search.js, variable_neighborhood_search.js,
  iterated_local_search.js, greedy_randomized_adaptive_search.js]
**/
const stochasticTwoOpt = (permutation) => {
  try {
    let perm = [ ...permutation ]
    let c1 = randomInteger(perm.length-1)
    let c2 = randomInteger(perm.length-1)
    let exclude = [c1]
    if (c1 === 0) exclude.push(perm.length-1)
    else exclude.push(c1-1)
    if (c1 === perm.length-1) exclude.push(0)
    else exclude.push(c1+1)
    while (exclude.includes(c2)) c2 = randomInteger(perm.length-1)
    if (c2 < c1) {
      c1 = c2
      c2 = c1
    }
    return [
      ...perm.slice(0,c1),
      ...perm.slice(c1,c2).reverse(),
      ...perm.slice(c2,perm.length)
    ]
  } catch (e) {
    throw new Error(`Stochastic two opt: ${e}`)
  }
}

/**
* range: Generates a range of numbers startAt...size
* @param {Number} size: size of the array range
* @param {Number} startAt: value to start the array, default 0
* @returns {Array} 1D array of values startAt...size
* @called stochastic: [variable_neighborhood_search.js]
* @notes Trying to mimic Ruby's range variable type
**/
const range = ({ size, startAt=0 }) => {
  return [...Array(size).keys()].map((i) => i + startAt)
}

/**
* arrayDifference: Removes values in arr1 that are in arr2
* @param {Array} arr1: array to remove values from
* @param {Array} arr2: array holding values to be removed from arr1
* @returns {Array} new array difference between arr1 and arr2
* @called stochastic: [greedy_randomized_adaptive_search.js, scatter_search.js]
* @notes Trying to mimic Ruby's array subtraction method
**/
const arrayDifference = ({ arr1, arr2 }) => {
  return arr1.map((c,i) => {
    if (arr2.includes(c)) return null
    return c
  }).filter((c) => c !== null)
}

/**
* binaryTournament: Runs a tournament between two random solutions and returns
  the fittest
* @param {Array} pop: Population of possible solutions
* @returns {Object} fittest solution between two randomly chosen in population
* @called Evolutionary: [genetic_algorithm.js]
**/
const binaryTournament = (pop) => {
  try {
    let i = randomInteger(pop.length-1)
    let j = randomInteger(pop.length-1)
    while (j === i) j = randomInteger(pop.length-1)
    if (pop[i].fitness > pop[j].fitness) return pop[i]
    return pop[j]
  } catch (e) {
    throw new Error(`Binary tournament: ${e}`)
  }
}

/**
* randomGaussian: generate a randomized gaussian number(normal distribution)
* @param {Number} mean: mean value(expected distribution)
* @param {Number} stdev: standard deviation
* @returns {Number} random gauss
* @called Evolutionary: [evolution_strategies.js, evolutionary_programming.js]
**/
const randomGaussian = (mean=0.0, stdev=1.0) => {
  try {
    let u1 = 0
    let u2 = 0
    let w = 0
    do {
      u1 = 2 * Math.random() - 1
      u2 = 2 * Math.random() - 1
      w = u1 * u1 + u2 * u2
    } while (w >= 1)
    w = Math.sqrt((-2.0 * Math.log(w)) / w)
    return mean + (u2 * w) * stdev
  } catch (e) {
    throw new Error(`Random gaussian: ${e}`)
  }
}

module.exports = {
  arrayDifference,
  binaryTournament,
  euclid2D,
  euclideanDistance,
  objectiveFunction,
  oneMax,
  randomBitstring,
  randomGaussian,
  randomInBounds,
  randomInteger,
  randomPerm,
  randomPermutation,
  randomVector,
  range,
  stochasticTwoOpt
}




/* END */
