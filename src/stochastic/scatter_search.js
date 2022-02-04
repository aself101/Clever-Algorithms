/*******************************************************************************
Clever Algorithms, pg 69
Scatter Search: The objective of Scatter Search is to maintain a set of diverse
and high quality candidate solutions. The principle of the approach is that
useful information about the global optima is stored in a diverse and elite
set of solutions (the reference set) and that recombining samples from the set
can exploit this information. The strategy involves an iterative process,
where a population of diverse and high-quality candidate solutions that
are partitioned into subsets and linearly recombined to create weighted
centroids of sample-based neighborhoods. The results of recombination
are refined using an embedded heuristic and assessed in the context of
the reference set as to whether or not they are retained.
Problem: Continuous function optimization; minimizing a cost function
*******************************************************************************/
const { objectiveFunction, randomVector, randomInBounds,
  euclideanDistance, arrayDifference } = require('../utils')

/**
* takeStep: Takes random positional steps within the bounds
* @param {Array} minmax: 2D array of bounds
* @param {Array} current: Current vector solution
* @param {Number} stepSize: size of the step
* @returns {Number} position within the bounds
* @called
**/
const takeStep = ({ minmax, current, stepSize }) => {
  try {
    return new Array(current.length).fill(0).map((p,i) => {
      return randomInBounds({
        min: Math.min(minmax[i][0], current[i] - stepSize),
        max: Math.max(minmax[i][1], current[i] + stepSize)
      })
    })
  } catch (e) {
    throw new Error(`Take step: ${e}`)
  }
}

/**
* localSearch: Searches for a candidate locally within a set bounds
* @param {Object} best: current best candidate solution
* @param {Array} bounds: 2D array of current bounds
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} stepSize: size of the step
* @returns {Object} best candidate from local search
* @called
**/
const localSearch = ({ best, bounds, maxNoImprov, stepSize }) => {
  try {
    let count = 0
    do {
      let candidate = {
        vector: takeStep({ minmax: bounds, current: best.vector, stepSize })
      }
      candidate.cost = objectiveFunction(candidate.vector)
      if (candidate.cost < best.cost) count = 0
      else count += 1
      if (candidate.cost < best.cost) best = candidate
    } while (count <= maxNoImprov)
    return best
  } catch (e) {
    throw new Error(`Local search: ${e}`)
  }
}

/**
* constructInitialSet: Constructs an initial diverse set of solutions
* @param {Array} bounds: 2D array of current bounds
* @param {Number} setSize: size of the set of solutions
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} stepSize: size of the step
* @returns {Array} set of diverse and possible solutions
* @called
**/
const constructInitialSet = ({ bounds, setSize, maxNoImprov, stepSize }) => {
  try {
    let diverseSet = []
    do {
      let candidate = { vector: randomVector(bounds) }
      candidate.cost = objectiveFunction(candidate.vector)
      candidate = localSearch({
        best: candidate,
        bounds,
        maxNoImprov,
        stepSize
      })
      if (!diverseSet.find((x) => x.vector.toString() === candidate.vector.toString())) {
        diverseSet.push(candidate)
      }
    } while (diverseSet.length !== setSize)
    return diverseSet
  } catch (e) {
    throw new Error(`Construct initial set: ${e}`)
  }
}

/**
* distance: Calculates the distance between two vectors usng euclidean distance
* @param {Array} vector: set of random values within preset bounds
* @param {Array} set: reference set
* @returns {Number} distance between two vectors
* @notes Using new euclideanDistance function can handle n dimensions, x, y, z, n...
**/
const distance = ({ vector, set }) => {
  try {
    return set.reduce((acc, cur) => {
      return acc + euclideanDistance({ c1: vector, c2: cur.vector })
    },0)
  } catch (e) {
    throw new Error(`Distance: ${e}`)
  }
}

/**
* diversify: diversifies the reference set(solutions of highest quality)
* @param {Array} diverseSet: diverse set of candidate solutions
* @param {Number} numElite: number of elite solutions
* @param {Array} set: reference set
* @returns {Array} new ref set of diversified solutions
* @notes
**/
const diversify = ({ diverseSet, numElite, refSetSize }) => {
  try {
    diverseSet = diverseSet.sort((a,b) => a.cost < b.cost ? -1 : 1)
    let refSet = new Array(numElite).fill(0).map((a,i) => diverseSet[i])
    let remainder = arrayDifference({
      arr1: diverseSet,
      arr2: refSet
    }).map((c,i) => {
      return { ...c,
        dist: distance({ vector: c.vector, set: refSet })
      }
    }).sort((a,b) => a.dist < b.dist ? 1 : -1)

    refSet = [ ...refSet,
      remainder[0],
      ...remainder.slice(refSetSize, refSet.length-1)
    ]
    return [refSet, refSet[0]]
  } catch (e) {
    throw new Error(`Diversify: ${e}`)
  }
}

/**
* selectSubsets: selects a subset from the refSet
* @param {Array} refSet: reference set
* @returns {Array} subsets of refSet
* @notes
**/
const selectSubsets = (refSet) => {
  try {
    let additions = refSet.filter((c) => c.new)
    let remainder = arrayDifference({
      arr1: refSet,
      arr2: additions
    })
    if (!remainder || remainder.length === 0) remainder = [ ...additions ]

    let subsets = []
    additions.map((a) => {
      remainder.map((r) => {
        if (a !== r && !subsets.find((s) => s.toString() === [r,a].toString())) {
          subsets.push([r, a])
        }
        return r
      })
      return a
    })
    return subsets
  } catch (e) {
    throw new Error(`Select subsets: ${e}`)
  }
}

/**
* recombine: selects a subset from the refSet
* @param {Array} subset: subset of reference set
* @param {Array} minmax: 2D array of bounds
* @returns {Array} children: of subset
* @notes
**/
const recombine = ({ subset, minmax }) => {
  try {
    let [a,b] = subset
    let d = new Array(a.vector.length).fill(0).map((r,i) => {
      return (b.vector[i] - a.vector[i]) / 2.0
    })

    let children = []
    subset.map((p) => {
      let r = Math.random()
      let direction = -1.0
      if (Math.random() < 0.5) direction = 1.0
      let child = {
        vector: new Array(minmax.length).fill(0).map((c,i) => {
          c = p.vector[i] + (direction * r * d[i])
          if (c < minmax[i][0]) c = minmax[i][0]
          if (c > minmax[i][1]) c = minmax[i][1]
          return c
        })
      }
      child.cost = objectiveFunction(child.vector)
      children.push(child)
      return p
    })
    return children
  } catch (e) {
    throw new Error(`Recombine: ${e}`)
  }
}

/**
* exploreSubsets: explores the subsets and searches for new candidate solutions for the refSet
* @param {Array} bounds: 2D array of current bounds
* @param {Array} refSet: reference set
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} stepSize: size of the step
* @returns {Boolean} wasChange: was there a change in the ref set
* @notes
**/
const exploreSubsets = ({ bounds, refSet, maxNoImprov, stepSize }) => {
  try {
    let wasChange = false
    let subsets = selectSubsets(refSet).map((c) => {
      return c.map((_c) => { return { ..._c, new: false } })
    })

    subsets.map((subset) => {
      let candidates = recombine({ subset, minmax: bounds })
      let improved = new Array(candidates.length).fill(0).map((c,i) => {
        return localSearch({
          best: candidates[i],
          bounds,
          maxNoImprov,
          stepSize
        })
      })
      improved.map((c) => {
        if (!refSet.find((x) => x.vector.toString() === c.vector.toString())) {
          c.new = true
          refSet = refSet.sort((a,b) => a.cost < b.cost ? -1 : 1)
          if (c.cost < refSet[refSet.length-1].cost) {
            refSet.pop()
            refSet.push(c)
            console.log(`>> Added, Cost: ${c.cost}`)
            wasChange = true
          }
        }
        return c
      })
      return subset
    })
    return wasChange
  } catch (e) {
    throw new Error(`Explore subsets: ${e}`)
  }
}

/**
* scatterSearch: Main search function
* @param {Array} bounds: 2D array of current bounds
* @param {Number} maxIter: max iterations
* @param {Number} refSetSize: size of reference set
* @param {Number} diverseSetSize: size of diverse set
* @param {Number} maxNoImprov: Determines when the search can no longer improve
* @param {Number} stepSize: size of the step
* @param {Number} maxElite: max of elite candidates
* @returns {Object} best solution
* @notes
**/
const scatterSearch = ({ bounds, maxIter, refSetSize, diverseSetSize,
  maxNoImprov, stepSize, maxElite }) => {
  try {
    let diverseSet = constructInitialSet({
      bounds,
      setSize: diverseSetSize,
      maxNoImprov,
      stepSize
    })
    let [refSet, best] = diversify({
      diverseSet,
      numElite: maxElite,
      refSetSize
    })
    refSet = refSet.map((c) => {
      return { ...c, new: true }
    })

    for (let i = 0; i < maxIter; i++) {
      const wasChange = exploreSubsets({
        bounds,
        refSet,
        maxNoImprov,
        stepSize
      })
      refSet = refSet.sort((a,b) => a.cost < b.cost ? -1 : 1)
      if (refSet[0].cost < best.cost) best = refSet[0]
      console.log(`> Iteration: ${i+1}, Best: ${best.cost}`)
      if (!wasChange) break
    }
    return best
  } catch (e) {
    throw new Error(`Scatter search: ${e}`)
  }
}


module.exports = { scatterSearch }








/* END */
