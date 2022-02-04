/*******************************************************************************
Clever Algorithms, pg 76
Tabu Search: The objective for the Tabu Search algorithm is to constrain
an embedded heuristic from returning to recently visited areas of the
search space, referred to as cycling. The strategy of the approach is to
maintain a short term memory of the specific changes of recent moves within the
search space and preventing future moves from undoing those changes.
Additional intermediate-term memory structures may be introduced
to bias moves toward promising areas of the search space, as well as
longer-term memory structures that promote a general diversity in the
search across the search space.
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
    throw new Error(`Stochastic two opt: ${e}`)
  }
}

/**
* isTabu: Checks whether a given route should be visited or if it is tabu!
* @param {Array} permutation: permutation of random indexes
* @param {Array} tabulist: list of edges that should not be revisted
* @returns {Boolean} true or false given the route and permutation
* @called
**/
const isTabu = ({ permutation, tabuList }) => {
  try {
    for (let i = 0; i < permutation.length; i++) {
      const c2 = (i === permutation.length - 1) ? permutation[0] : permutation[i+1]
      for (let forbiddenEdge of tabuList) {
        if (forbiddenEdge.toString() === [permutation[i],c2].toString()) return true
      }
    }
    return false
  } catch (e) {
    throw new Error(`Is tabu?: ${e}`)
  }
}

/**
* generateCandidate: Generates a candidate solution
* @param {Array} best: current best candidate solution
* @param {Array} tabulist: list of edges that should not be revisted
* @param {Array} cities: 2D array of all available cities
* @returns {Object} candidate solution and parent edges
* @called
**/
const generateCandidate = ({ best, tabuList, cities }) => {
  try {
    let perm = null
    let edges = null
    do {
      [perm, edges] = tabuStochasticTwoOpt(best.vector)
    } while (isTabu({ permutation: perm, tabuList }))
    let candidate = { vector: perm }
    candidate.cost = cost({ permutation: candidate.vector, cities })
    return { candidate, edges }
  } catch (e) {
    throw new Error(`Generate candidate: ${e}`)
  }
}

/**
* tabuSearch
* @param {Array} cities: 2D array of all available cities
* @param {Number} tabulistSize: max size of tabu list
* @param {Number} candidatelistSize: max size of candidates
* @param {Number} maxIter: max iterations
* @returns {Object} candidate solution and edges
* @called
**/
const tabuSearch = ({ cities, tabuListSize, candidateListSize, maxIter }) => {
  try {
    let current = { vector: randomPermutation(cities) }
    current.cost = cost({ permutation: current.vector, cities })
    let best = current
    let tabuList = new Array(tabuListSize).fill(0)

    for (let i = 0; i < maxIter; i++) {
      const candidates = new Array(candidateListSize).fill(0).map((a,j) => {
        return generateCandidate({ best: current, tabuList, cities })
      }).sort((a,b) => a.cost < b.cost ? -1 : 1)
      const bestCandidate = candidates[0].candidate
      const bestCandidateEdges = candidates[0].edges
      if (bestCandidate.cost < current.cost) {
        current = bestCandidate
        if (bestCandidate.cost < best.cost) best = bestCandidate
        bestCandidateEdges.map((edge) => {
          tabuList.push(edge)
          return edge
        })
        while (tabuList.length > tabuListSize) tabuList.pop()
      }
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}`)
    }
    return best
  } catch (e) {
    throw new Error(`Tabu search: ${e}`)
  }
}


module.exports = { tabuSearch }

/* END */
