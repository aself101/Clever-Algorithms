/*******************************************************************************
Stoachistic Algorithms
Random Search
*******************************************************************************/
const { randomSearch } = require('./random_search')
const { adaptiveRandomSearch } = require('./adaptive_random_search')


const main = () => {
  try {

  } catch (e) {
    throw new Error(`Main() Random search: ${e}`)
  }
}

main()

module.exports = {
  adaptiveRandomSearch,
  randomSearch
}





/*
  Testing
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

*/





/* END */
