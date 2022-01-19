/*******************************************************************************
Stoachistic Algorithms
Random Search
Adaptive Random Search
*******************************************************************************/
const { BERLIN_52 } = require('../utils')
const { randomSearch } = require('./random_search')
const { adaptiveRandomSearch } = require('./adaptive_random_search')
const { stochasticHillSearch } = require('./stochastic_hill_climbing')
const { iteratedLocalSearch } = require('./iterated_local_search')

const main = () => {
  try {

  } catch (e) {
    throw new Error(`Main() Stochastic: ${e}`)
  }
}

main()

module.exports = {
  adaptiveRandomSearch,
  iteratedLocalSearch,
  randomSearch,
  stochasticHillSearch
}

/*
  ****************************** Testing ******************************
  ** RANDOM SEARCH **
  The example problem is an instance of a continuous function optimization that
  seeks min f (x) where f = i=1 x 2 i, −5.0 ≤ x i ≤ 5.0 and n = 2. The optimal
  solution for this basin function is (v 0 , . . . , v n−1 ) = 0.0.
  // Problem configuration
  const problemSize = 2
  const searchSpace = new Array(problemSize).fill([-5,5])
  // Algorithm configuration
  const maxIter = 100
  const best = randomSearch({ searchSpace, maxIter })
  console.log(`Done. Best Solution: Cost=${best.cost}, Vector=${best.vector}`)

  ** ADAPTIVE RANDOM SEARCH **
  The example problem is an instance of a continuous function optimization that
  seeks min f (x) where f = i=1 x 2 i, −5.0 ≤ x i ≤ 5.0 and n = 2. The optimal
  solution for this basin function is (v 0 , . . . , v n−1 ) = 0.0.
  // Problem configuration
  const problemSize = 2
  const searchSpace = new Array(problemSize).fill([-5,5])
  // Algorithm configuration
  const maxIter = 1000
  const initFactor = 0.05
  const sFactor = 1.3
  const lFactor = 3.0
  const iterMult = 10
  const maxNoImprov = 30

  const best = adaptiveRandomSearch({ maxIter, bounds: searchSpace, initFactor,
    sFactor, lFactor, iterMult, maxNoImprov })
  console.log(`Done. Best Solution: Cost=${best.cost}, Vector=${best.vector}`)

  ** STOCHASTIC HILL CLIMBING
  The algorithm is executed for a fixed number of iterations
  and is applied to a binary string optimization problem called ‘One Max’.
  The objective of this maximization problem is to prepare a string of all
  ‘1’ bits, where the cost function only reports the number of bits in a
  given string.
  // Problem configuration
  const numBits = 64
  // Algorithm configuration
  const maxIter = 1000
  console.log('Starting')
  const best = stochasticHillSearch({ maxIter, numBits })
  console.log(`Done. Best Solution: Cost=${best.cost}, Vector=${best.vector.join('')}`)

  ** ITERATED LOCAL SEARCH **
  // Problem configuration
  // The optimal tour distance for Berlin52 instance is 7542 units.
  // Note: This algo is not the best
  const cities = [ ...BERLIN_52 ]
  // Algorithm configuration
  const maxIter = 1000
  const maxNoImprov = 50
  const best = iteratedLocalSearch({ cities, maxIter, maxNoImprov })
  console.log(`Done. Best Solution: ${best.cost}, Vector: ${best.vector}`)
*/





/* END */
