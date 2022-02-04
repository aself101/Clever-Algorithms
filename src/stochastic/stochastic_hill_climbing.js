/*******************************************************************************
Clever Algorithms, pg 40
Stochastic Hill Climbing: The strategy of the Stochastic Hill Climbing
algorithm is iterate the process of randomly selecting a neighbor for a
candidate solution and only accept it if it results in an improvement.
The strategy was proposed to address the limitations of deterministic hill
climbing techniques that were likely to get stuck in local optima due to their
greedy acceptance of neighboring moves.
Problem: Binary string optimization
*******************************************************************************/
const { oneMax, randomBitstring, randomInteger } = require('../utils')

/**
* randomNeighbor: Generates a random bitstring neighbor;
  mutates one position in array
* @param {Array} bitstring: bitstring to mutate
* @returns {Array} Random position swapped bitstring
* @called
**/
const randomNeighbor = (bitstring) => {
  try {
    let mutant = [ ...bitstring ]
    let pos = randomInteger(bitstring.length)
    if (mutant[pos] === '1') mutant[pos] = '0'
    else mutant[pos] = '1'
    return mutant
  } catch (e) {
    throw new Error(`Random neighbor: ${e}`)
  }
}

/**
* stochasticHillSearch: Search for optimal binary representation of onemax problem
  by finding a string of all '1' bits
  mutates one position in array
* @param {Number} maxIter: max iterations
* @param {Number} numBits: Max number of bits in string
* @returns {Object} candidate: Best candidate solution: cost, bitstring
* @called
**/
const stochasticHillClimbingSearch = ({ maxIter, numBits }) => {
  try {
    let candidate = { vector: randomBitstring(numBits) }
    candidate.cost = oneMax(candidate.vector)

    for (let i = 0; i < maxIter; i++) {
      let neighbor = { vector: randomNeighbor(candidate.vector) }
      neighbor.cost = oneMax(neighbor.vector)

      if (neighbor.cost >= candidate.cost) candidate = neighbor
      console.log(`> Iteration: ${i+1}, Best: ${candidate.cost}, Bitstring: ${candidate.vector.join('')}`)
      if (candidate.cost === numBits) break
    }

    return candidate
  } catch (e) {
    throw new Error(`Stochastic hill search: ${e}`)
  }
}

module.exports = { stochasticHillClimbingSearch }

/* END */
