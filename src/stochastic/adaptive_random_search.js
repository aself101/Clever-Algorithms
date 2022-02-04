/*******************************************************************************
Clever Algorithms, pg 34
Adaptive Random Search: The Adaptive Random Search algorithm was designed to
address the limitations of the fixed step size in the Localized Random Search
algorithm. The strategy for Adaptive Random Search is to continually
approximate the optimal step size required to reach the global optimum
in the search space. This is achieved by trialling and adopting smaller
or larger step sizes only if they result in an improvement in the search
performance.
Problem: Continuous function optimization; minimizing a cost function
*******************************************************************************/
const { objectiveFunction, randomVector, randomInBounds } = require('../utils')

/**
* takeStep: Takes a random step
* @param {Array} minmax: 2D array of current search space
* @param {Array} current: 1D vector of current candidate values
* @returns {Number} stepSize: size of step to take through search space
* @called takeSteps()
**/
const takeStep = ({ minmax, current, stepSize }) => {
  try {
    return new Array(current.length).fill(0).map((a,i) => {
      let min = Math.max(minmax[i][0], current[i]-stepSize)
      let max = Math.min(minmax[i][1], current[i]+stepSize)
      return randomInBounds({ min, max })
    })
  } catch (e) {
    throw new Error(`Take step: ${e}`)
  }
}

/**
* largeStepSize: Sets the value for the step size
* @param {Number} iter: current iteration
* @param {Number} stepSize: size of step to take through search space
* @param {Number} sFactor: small factor determining step size
* @param {Number} lFactor: large factor determining step size
* @param {Number} iterMult: iteration multiplier
* @returns {Number} large step size
* @called adaptiveRandomSearch()
**/
const largeStepSize = ({ iter, stepSize, sFactor, lFactor, iterMult }) => {
  try {
    if (iter > 0 && iter % iterMult === 0) return stepSize * lFactor
    return stepSize * sFactor
  } catch (e) {
    throw new Error(`Large step size: ${e}`)
  }
}

/**
* takeSteps: Takes a step and big step
* @param {Array} bounds: 2D array of current search space
* @param {Object} current: current candidate solution
* @param {Number} stepSize: size of step to take through search space
* @param {Number} bigStepSize: size of step to take through search space
* @returns {Object} step and big step
* @called adaptiveRandomSearch()
**/
const takeSteps = ({ bounds, current, stepSize, bigStepSize }) => {
  try {
    let step = {
      vector: takeStep({
        minmax: bounds,
        current: current.vector,
        stepSize
      })
    }
    let bigStep = {
      vector: takeStep({
        minmax: bounds,
        current: current.vector,
        stepSize: bigStepSize
      })
    }
    step.cost = objectiveFunction(step.vector)
    bigStep.cost = objectiveFunction(bigStep.vector)

    return { step, bigStep }
  } catch (e) {
    throw new Error(`Take steps: ${e}`)
  }
}

/**
* adaptiveRandomSearch: randomly search through space to find best solution;
  adapt through each iter
* @param {Number} maxIter: max iterations
* @param {Array} bounds: 2D array of current search space
* @param {Number} initFactor: determines initial step size
* @param {Number} sFactor: small factor determining step size
* @param {Number} lFactor: large factor determining step size
* @param {Number} iterMult: iteration multiplier
* @param {Number} maxNoImprov: max val if no improvement of count
* @returns {Number} large step size
* @called
**/
const adaptiveRandomSearch = ({ maxIter, bounds, initFactor, sFactor, lFactor,
  iterMult, maxNoImprov }) => {
  try {
    let stepSize = (bounds[0][1] - bounds[0][0]) * initFactor
    let count = 0
    let current = { vector: randomVector(bounds) }
    current.cost = objectiveFunction(current.vector)

    for (let i = 0; i < maxIter; i++) {
      const bigStepSize = largeStepSize({
        iter: i, stepSize, sFactor, lFactor, iterMult
      })
      const { step, bigStep } = takeSteps({
        bounds, current, stepSize, bigStepSize
      })
      if (step.cost <= current.cost || bigStep.cost <= current.cost) {
        if (bigStep.cost <= step.cost) {
          stepSize = bigStepSize
          current = bigStep
        } else current = step
        count = 0
      } else {
        count += 1
        if (count >= maxNoImprov) {
          count = 0
          stepSize = (stepSize / sFactor)
        }
      }
      console.log(`> Iteration: ${i+1}, Best: ${current.cost}`)
    }

    return current
  } catch (e) {
    throw new Error(`Adaptive random search: ${e}`)
  }
}

module.exports = { adaptiveRandomSearch }


/* END */
