/*******************************************************************************
Clever Algorithms, pg 82
Reactive Tabu Search: The objective of Tabu Search is to avoid cycles while
applying a local search technique. The Reactive Tabu Search addresses this
objective by explicitly monitoring the search and reacting to the occurrence of
cycles and their repetition by adapting the tabu tenure (tabu list size).
The strategy of the broader field of Reactive Search Optimization is
to automate the process by which a practitioner configures a search
procedure by monitoring its online behavior and to use machine learning
techniques to adapt a techniques configuration.
Problem: TSP
*******************************************************************************/
const { euclid2D, randomPermutation, randomInteger } = require('../utils')

/**
* cost: Calculates the cost of route
* @param {Array} permutation: Random permutation of a city
* @param {Array} cities: 2D array of all available cities
* @returns {Number} cost between two locations
* @called
**/
const cost = ({ permutation, cities }) => {
  try {
    return permutation.reduce((acc, c1, i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      return acc + euclid2D({ c1: cities[c1], c2: cities[c2] })
    },0)
  } catch (e) {
    throw new Error(`Cost: ${e}`)
  }
}

/**
* stochasticTwoOpt: Generates a new random permutation
* @param {Array} parent: permutation of random indexes
* @returns {Array} 1D array of random indexes
* @called
**/
const tabuStochasticTwoOpt = (parent) => {
  try {
    let perm = [ ...parent ]
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
      [
        ...perm.slice(0,c1),
        ...perm.slice(c1,c2).reverse(),
        ...perm.slice(c2,perm.length)
      ],
      [[parent[c1-1], parent[c1]],[parent[c2-1], parent[c2]]]
    ]
  } catch (e) {
    throw new Error(`Tabu stochastic two opt: ${e}`)
  }
}

/**
* isTabu: Checks whether a given route should be visited or if it is tabu!
* @param {Array} edge: edge of possible travel route
* @param {Array} tabulist: list of edges that should not be revisted
* @param {Number} iter: current iteration
* @param {Number} prohibPeriod: period of time a route is prohibited to be visited
* @returns {Boolean} true or false given the route and edge
* @called
**/
const isTabu = ({ edge, tabuList, iter, prohibPeriod }) => {
  try {
    for (let entry of tabuList) {
      if (entry.edge.toString() === edge.toString()) {
        if (entry.iter >= iter - prohibPeriod) return true
        return false
      }
    }
    return false
  } catch (e) {
    throw new Error(`Is tabu?: ${e}`)
  }
}

/**
* makeTabu: Sets an entry in the routes to tabu and sets iteration(prohibited time)
* @param {Array} tabulist: list of edges that should not be revisted
* @param {Array} edge: edge of possible travel route
* @param {Number} iter: current iteration
* @returns {Object} new tabu entry(remains tabu for specified period of time(iter))
* @called
**/
const makeTabu = ({ tabuList, edge, iter }) => {
  try {
    for (let entry of tabuList) {
      if (entry.edge.toString() === edge.toString()) {
        entry.iter = iter
        return entry
      }
    }
    const entry = { edge, iter }
    tabuList.push(entry)
    return entry
  } catch (e) {
    throw new Error(`Make tabu: ${e}`)
  }
}

/**
* toEdgeList: Creates a list of edges within the permutation routes
* @param {Array} permutation: current permutation route
* @returns {Array} List of edge routes
* @called
**/
const toEdgeList = (permutation) => {
  try {
    return permutation.map((c1, i) => {
      let c2 = (i === permutation.length-1) ? permutation[0] : permutation[i+1]
      if (c1 > c2) {
        c1 = c2
        c2 = c1
      }
      return [c1,c2]
    })
  } catch (e) {
    throw new Error(`To edge list: ${e}`)
  }
}

/**
* equivalent: Checks whether two edge lists contain the same record
* @param {Array} el1: edge list 1
* @param {Array} el2: edge list 2
* @returns {Boolean} true or false depending on if an edge exists in the same list
* @called
**/
const equivalent = ({ el1, el2 }) => {
  try {
    for (let e of el1) {
      for (let edge of el2) {
        if (e.toString() === edge.toString()) return true
      }
    }
    return false
  } catch (e) {
    throw new Error(`Equivalent: ${e}`)
  }
}

/**
* generateCandidate: Generates a candidate solution
* @param {Array} best: current best candidate solution
* @param {Array} cities: 2D array of all available cities
* @returns {Object} candidate solution and parent edges
* @called
**/
const generateCandidate = ({ best, cities }) => {
  try {
    let candidate = {}
    let [vector, edges] = tabuStochasticTwoOpt(best.vector)
    candidate.vector = vector
    candidate.cost = cost({ permutation: candidate.vector, cities })
    return [candidate, edges]
  } catch (e) {
    throw new Error(`Generate candidate: ${e}`)
  }
}

/**
* getCandidateEntry: Returns a visited entry path from the candidate solution
* @param {Array} visitedList: List of visied edges
* @param {Array} permutation: current permutation routes
* @returns {Object} entry or null depending on edgelist equivalency
* @called
**/
const getCandidateEntry = ({ visitedList, permutation }) => {
  try {
    const edgeList = toEdgeList(permutation)
    for (let entry of visitedList) {
      if (equivalent({ el1: edgeList, el2: entry.edgeList })) return entry
    }
    return null
  } catch (e) {
    throw new Error(`Get candidate entry: ${e}`)
  }
}

/**
* storePermutation: Stores a permutation's edgeList in the visited list
* @param {Array} visitedList: List of visied edges
* @param {Array} permutation: current permutation routes
* @param {Number} iteration: current iteration
* @returns {Object} entry
* @called
**/
const storePermutation = ({ visitedList, permutation, iteration }) => {
  try {
    const entry = {
      edgeList: toEdgeList(permutation),
      iter: iteration,
      visits: 1
    }
    visitedList.push(entry)
    return entry
  } catch (e) {
    throw new Error(`Store permutation: ${e}`)
  }
}

/**
* sortNeighborhood: Sorts a neighborhood of candidate solutions and checks whether
  each path is admissible or tabu
* @param {Array} candidates: Current candidate solutions
* @param {Array} tabulist: list of edges that should not be revisted
* @param {Number} prohibPeriod: period of time a route is prohibited to be visited
* @param {Number} iteration: current iteration
* @returns {Array} tabu and admissible solutions
* @called
**/
const sortNeighborhood = ({ candidates, tabuList, prohibPeriod, iteration }) => {
  try {
    let tabu = []
    let admissible = []
    candidates.map((a,i) => {
      if (isTabu({ edge: a[1][0], tabuList, iter: iteration, prohibPeriod }) ||
          isTabu({ edge: a[1][1], tabuList, iter: iteration, prohibPeriod })) {
          tabu.push(a)
      } else admissible.push(a)
      return a
    })
    return [tabu, admissible]
  } catch (e) {
    throw new Error(`Sort neighborhood: ${e}`)
  }
}

/**
* reactiveTabuSearch: main search function
* @param {Array} cities: city dataset
* @param {Array} maxCand: max list of available candidate solutions
* @param {Number} maxIter: max iterations
* @param {Number} increase: regulates prohibPeriod
* @param {Number} decrease: regulates prohibPeriod
* @returns {Object} Best solution
* @called
**/
const reactiveTabuSearch = ({ cities, maxCand, maxIter, increase, decrease }) => {
  try {
    let current = { vector: randomPermutation(cities) }
    current.cost = cost({ permutation: current.vector, cities })
    let best = { ...current }
    let tabuList = []
    let prohibPeriod = 1
    let visitedList = []
    let avgSize = 1
    let lastChange = 0

    for (let i = 0; i < maxIter; i++) {
      let candidateEntry = getCandidateEntry({ visitedList, permutation: current.vector })

      if (candidateEntry !== null) {
        let repetitionInterval = i - candidateEntry.iter
        candidateEntry.iter = i
        candidateEntry.visits += 1

        if (repetitionInterval < 2 * (cities.length - 1)) {
          avgSize = 0.1 * (i - candidateEntry.iter) + 0.9 * avgSize
          prohibPeriod = (prohibPeriod * increase)
          lastChange = i
        }
      } else storePermutation({ visitedList, permutation: current.vector, iteration: i })

      if (i - lastChange > avgSize) {
        prohibPeriod = Math.max(prohibPeriod*decrease, 1)
        lastChange = i
      }

      let candidates = new Array(maxCand).fill({}).map((a,i) => {
        return generateCandidate({ best: current, cities })
      }).sort((a,b) => a[0].cost < b[0].cost ? -1 : 1)

      let [tabu, admissible] = sortNeighborhood({
        candidates,
        tabuList,
        prohibPeriod,
        iteration: i
      })

      if (admissible.length < 2) {
        prohibPeriod = cities.length - 2
        lastChange = i
      }
      let bestMoveEdges = null
      if (admissible.length === 0) {
        [current, bestMoveEdges] = tabu[0]
      } else [current, bestMoveEdges] = admissible[0]

      if (tabu.length !== 0) {
        let tf = tabu[0][0]
        if (tf.cost < best.cost && tf.cost < current.cost) {
          [current, bestMoveEdges] = tabu[0]
        }
      }

      for (let edge of bestMoveEdges) makeTabu({ tabuList, edge, iter: i })

      if (candidates[0][0].cost < best.cost) best = candidates[0][0]
      //console.log(`> Iteration: ${i+1}, Tenure: ${prohibPeriod}, Best: ${best.cost}`)
    }

    return best
  } catch (e) {
    throw new Error(`Reactive tabu search: ${e}`)
  }
}

module.exports = { reactiveTabuSearch }

/* END */
