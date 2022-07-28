/*******************************************************************************
Clever Algorithms, pg 194
Cultural Algorithm: The information processing objective of the algorithm is to 
improve the learning or convergence of an embedded search technique (typically an
evolutionary algorithm) using a higher-order cultural evolution. The
algorithm operates at two levels: a population level and a cultural level.
The population level is like an evolutionary search, where individuals rep-
resent candidate solutions, are mostly distinct and their characteristics
are translated into an objective or cost function in the problem domain.
The second level is the knowledge or believe space where information
acquired by generations is stored, and which is accessible to the current
Problem: Function optimization
*******************************************************************************/
const {
  binaryTournament, 
  objectiveFunction, 
  randomVector, 
  randomInBounds,
  randomInteger 
} = require('../utils')

/**
* mutateWithInf: mutates the candidate vector
* @param {Array} searchSpace: problem domain
* @returns {Object} new belief space object
* @called
**/
const mutateWithInf = ({ candidate, beliefs, minmax }) => {
  try {
    return {
      vector: candidate.vector.map((c,i) => {
        let val = randomInBounds({
          min: beliefs.normative[i][0],
          max: beliefs.normative[i][1]
        })
        if (val < minmax[i][0]) val = minmax[i][0]
        if (val > minmax[i][1]) val = minmax[i][1]
        return val
      })
    }
  } catch (e) {
    throw new Error(`mutateWithInf(): ${e}`)
  }
}

/**
* initializeBeliefSpace: creates a new belief space data structure
* @param {Array} searchSpace: problem domain
* @returns {Object} new belief space object
* @called
**/
const initializeBeliefSpace = (searchSpace) => {
  try {
    if (!searchSpace) {
      return { 
        situational: null,
        normative: [[]] 
      }
    }
    return {
      situational: null,
      normative: new Array(searchSpace.length).fill([]).map((a,i) => {
        return searchSpace[i]
      }) 
    }
  } catch (e) {
    throw new Error(`initializeBeliefSpace(): ${e}`)
  }
}

/**
* updateBeliefSpaceSituational: updates the situational belief
* @param {Array} searchSpace: problem domain
* @returns
* @called
**/
const updateBeliefSpaceSituational = ({ beliefSpace, best }) => {
  try {
    const currBest = beliefSpace.situational
    if (currBest === null || best.fitness < currBest.fitness) {
      beliefSpace.situational = best
    }
  } catch (e) {
    throw new Error(`updateBeliefSpaceSituational(): ${e}`)
  }
}
/**
* updateBeliefSpaceNormative: updates the normative belief
* @param {Array} searchSpace: problem domain
* @returns
* @called
**/
const updateBeliefSpaceNormative = ({ beliefSpace, acc }) => {
  try {
    return { ...beliefSpace,
      normative: beliefSpace.normative.map((bounds,i) => {
        bounds[0] = Math.min(...acc.map((x) => x.vector[i]))
        bounds[1] = Math.max(...acc.map((x) => x.vector[i]))
        return bounds
      })
    }
  } catch (e) {
    throw new Error(`updateBeliefSpaceNormative(): ${e}`)
  }
}
/**
* culturalSearch: Cultural algorithm seach function
* @param {Array} searchSpace: problem domain
* @returns
* @called
**/
const culturalSearch = ({ maxGens, searchSpace, popSize, numAccepted }) => {
  try {
    let pop = new Array(popSize).fill({}).map((p,i) => {
      const vector = randomVector(searchSpace)
      return { 
        vector,
        fitness: objectiveFunction(vector) 
      }
    })
    
    let beliefSpace = initializeBeliefSpace(searchSpace)
    
    let best = pop.sort((a,b) => a.fitness < b.fitness ? -1 : 1)[0]
    updateBeliefSpaceSituational({ beliefSpace, best })
    
    for (let gen = 0; gen < maxGens; gen++) {
      let children = new Array(popSize).fill({}).map((p,i) => {
        return mutateWithInf({ 
          candidate: pop[i],
          beliefs: beliefSpace,
          minmax: searchSpace 
        })
      }).map((c,i) => {
        return { ...c,
          fitness: objectiveFunction(c.vector) 
        }
      })
      best = children.sort((a,b) => a.fitness < b.fitness ? -1 : 1)[0]
      updateBeliefSpaceSituational({ beliefSpace, best })
      pop = pop.map((c,i) => {
        return binaryTournament([...children, ...pop])
      }).sort((a,b) => a.fitness < b.fitness ? -1 : 1)
      
      let accepted = pop.slice(0, numAccepted)
      updateBeliefSpaceNormative({ beliefSpace, acc: accepted })
      console.log(`> Generation: ${gen}, Fitness: ${beliefSpace.situational.fitness}`)
    }

    return beliefSpace.situational
  } catch (e) {
    throw new Error(`search(): ${e}`)
  }
}







module.exports = { culturalSearch }













/* END */