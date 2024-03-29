/*******************************************************************************
Clever Algorithms by Jason Brownlee
Al original code written in Ruby, translated to Javascript
*******************************************************************************/
const { BERLIN_52 } = require('./src/constants')
const { range } = require('./src/utils')
const {
  adaptiveRandomSearch,
  greedyRandomizedAdaptiveSearch,
  guidedLocalSearch,
  iteratedLocalSearch,
  randomSearch,
  reactiveTabuSearch,
  scatterSearch,
  stochasticHillClimbingSearch,
  tabuSearch,
  variableNeighborhoodSearch
} = require('./src/stochastic')

const {
  differentialEvolutionSearch,
  evolutionaryProgrammingSearch,
  evolutionaryStrategySearch,
  executeLearningClassifier,
  geneticAlgorithmSearch,
  nonDominatedGASearch
} = require('./src/evolutionary')

const {
  culturalSearch,
  extremalOptimizationSearch,
  harmonySearch,
  simulatedAnnealingSearch
} = require('./src/physical')

const main = () => {
  try {
    // Problem configuration
    const problemSize = 2
    const searchSpace = new Array(problemSize).fill([-5,5])
    // Algorithm configuration
    const maxGens = 200
    const popSize = 100
    const numAccepted = Math.round(popSize * 0.20)
    const best = culturalSearch({
      maxGens,
      searchSpace,
      popSize,
      numAccepted
    })
    console.log(`Done! Solution: F=${best.fitness}, S=${best.vector}`)
    return 1
  } catch (e) {
    throw new Error(`Main() Stochastic: ${e}`)
  }
}

main()

/*
  ****************************** Testing Stochastic Algos ******************************
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

  ** STOCHASTIC HILL CLIMBING **
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
  const best = stochasticHillClimbingSearch({ maxIter, numBits })
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

  ** GUIDED LOCAL SEARCH **
  // Note: Best algo for Berlin52
  // Algorithm configuration
  const maxIter = 150
  const maxNoImprov = 20
  const alpha = 20
  const localSearchOptima = 12000
  const lambda = alpha * (localSearchOptima / BERLIN_52.length)

  const best = guidedLocalSearch({ maxIter, cities: BERLIN_52, maxNoImprov, lambda })
  console.log(`Done. Best Solution: ${best.cost}, Vector: ${best.vector}`)

  ** VARIABLE NEIGHBORHOOD SEARCH **
  // Algorithm configuration
  const maxNoImprov = 50 // Tweak these for better solutions; higher === better
  const maxNoImprovLs = 70 // Tweak these for better solutions; higher === better
  const neighborhoods = range({ size: 20, startAt: 1 })

  const best = variableNeighborhoodSearch({
    cities: BERLIN_52,
    neighborhoods,
    maxNoImprov,
    maxNoImprovLs
  })
  console.log(`Done. Best Solution: ${best.cost}, Vector: ${best.vector}`)

  ** GREEDY ADAPTIVE RANDOMIZED SEARCH **
  // Algorithm configuration
  const maxIter = 15000
  const maxNoImprov = 150
  const greedinessFactor = 0.25 // (0 too greedy, 1 to general)

  const best = greedyRandomizedAdaptiveSearch({
    cities: BERLIN_52,
    maxIter,
    maxNoImprov,
    alpha: greedinessFactor
  })

  console.log(`Done. Best Solution: ${best.cost}, Vector: ${best.vector}`)

  ** SCATTER SEARCH **
  // Problem configuration
  const problemSize = 3
  const bounds = new Array(problemSize).fill([-5,5])
  // Algorithm configuration
  const maxIter = 100
  const maxNoImprov = 30
  const stepSize = (bounds[0][1]-bounds[0][0]) * 0.005
  const refSetSize = 10
  const diverseSetSize = 20
  const numElite = 5

  const best = scatterSearch({
    bounds,
    maxIter,
    refSetSize,
    diverseSetSize,
    maxNoImprov,
    stepSize,
    maxElite: numElite
  })

  console.log(`Done. Best Solution: ${best.cost}, Vector: ${best.vector}`)

  ** TABU SEARCH **
  // Algorithm configuration
  const maxIter = 10000
  const tabuListSize = 15
  const maxCandidates = 50
  const best = tabuSearch({
    cities: BERLIN_52,
    tabuListSize,
    candidateListSize: maxCandidates,
    maxIter
  })
  console.log(`Done. Best Solution: Cost=${best.cost}, Vector=${best.vector}`)

  ** REACTIVE TABU SEARCH **
  // Algorithm configuration
  const maxIter = 100
  const maxCandidates = 50
  const increase = 1.3
  const decrease = 0.9
  const best = reactiveTabuSearch({
    cities: BERLIN_52,
    maxCand: maxCandidates,
    maxIter,
    increase,
    decrease
  })
  console.log(`Done. Best Solution: Cost=${best.cost}, Vector=${best.vector}`)

  ** GENETIC ALGORITHM **
  // Problem configuration
  const numBits = 64
  // Algorithm configuration
  const maxGens = 100
  const popSize = 100
  const pCrossover = 0.98
  const pMutation = 1.0 / numBits

  const best = geneticAlgorithmSearch({
    maxGens,
    numBits,
    popSize,
    pCrossover,
    pMutation
  })

  console.log(`Done. Solution: ${best.fitness}, Generation: ${best.generation}, Bitstring: ${best.bitstring.join('')}`)

  ** EVOLUTIONARY STRATEGY **
  // Problem configuration
  const problemSize = 10
  const searchSpace = new Array(problemSize).fill([-50,50])
  // Algorithm configuration
  const maxGens = 1000
  const popSize = 30
  const numChildren = 20

  const best = evolutionaryStrategySearch({
    maxGens,
    searchSpace,
    popSize,
    numChildren
  })

  console.log(`Done. Solution: ${best.fitness}, Vector: ${best.vector}`)

  ** DIFFERENTIAL EVOLUTION **
  // Problem configuration
  const problemSize = 3
  const searchSpace = new Array(problemSize).fill([-5,5])
  // Algorithm configuration
  const maxGens = 200
  const popSize = 10 * problemSize
  const weightF = 0.8
  const crossF = 0.9

  const best = differentialEvolutionSearch({
    maxGens,
    searchSpace,
    popSize,
    f: weightF,
    cr: crossF
  })

  console.log(`Done. Solution: ${best.cost}, Vector: ${best.vector}`)

  ** NON DOMINATED SORTING GENETIC ALGORITHM **
  // Problem configuration
  const problemSize = 1
  const searchSpace = new Array(problemSize).fill([-10,10])
  // Algorithm configuration
  const maxGens = 500
  const popSize = 100
  const pCross = 0.80
  const pop = nonDominatedGASearch({
    searchSpace,
    maxGens,
    popSize,
    pCross
  })
  console.log('Done!')

  ** SIMULATED ANNEALING **
  // Algorithm configuration
    const maxIter = 2000
    const maxTemp = 100000
    const tempChange = 0.98
    const best = simulatedAnnealingSearch({
      cities: BERLIN_52,
      maxIter,
      maxTemp,
      tempChange
    })
    console.log(`Done. Best solution: ${best.cost}, V: ${best.vector}`)
  
    ** EXTREMAL OPTIMIZATION ** // Worst one yet
    // Algorithm configuration
    const maxIter = 250
    const tau = 1.8
    const best = extremalOptimizationSearch({
      cities: BERLIN_52,
      maxIter,
      tau
    })
    console.log(`Done. Best solution: ${best.cost}, V: ${best.vector}`)

    ** HARMONY SEARCH **
    // Problem configuration
    const problemSize = 3
    const bounds = new Array(problemSize).fill([-5,5])
    // Algorithm configuration
    const memSize = 20
    const considRate = 0.95
    const adjustRate = 0.7
    const range = 0.05
    const maxIter = 500
    const best = harmonySearch({
      bounds,
      maxIter,
      memSize,
      considRate,
      adjustRate,
      range
    })
    console.log(`Done! Solution: F=${best.fitness}, S=${best.vector}`)
*/
