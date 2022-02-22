/*******************************************************************************
Clever Algorithms, pg 146
Learning Classifier System: The objective of the Learning Classifier System
algorithm is to optimize payoff based on exposure to stimuli from a
problem-specific environment. This is achieved by managing credit assignment
for those rules that prove useful and searching for new rules and new
variations on existing rules using an evolutionary process.
Incomplete: 2.18.22
*******************************************************************************/
const { randomBitstring, randomInteger, arrayDifference,
  binaryTournament } = require('../utils')
/**
* neg: Negates a bit value
* @param {Number} bit: value in string of bits
* @returns {Number} Opposite value provided
**/
const neg = (bit) => {
  try {
    return (bit === 1) ? 0 : 1
  } catch (e) {
    throw new Error(`Neg: ${e}`)
  }
}
/**
* targetFunction: Boolean multiplexer function
* @param {Array} s: bitstring
* @returns {Number} value of multiplexer
**/
const targetFunction = (s) => {
  try {
    const ints = new Array(6).fill(0).map((a,i) => Number(s[i]))
    const [x0,x1,x2,x3,x4,x5] = ints
    return neg(x0)*neg(x1)*x2 + neg(x0)*x1*x3 + x0*neg(x1)*x4 + x0*x1*x5
  } catch (e) {
    throw new Error(`Target function: ${e}`)
  }
}
/**
* newClassifier: Creates a new classifier
* @param {String} condition: 0,1,#
* @param {String} action: '0','1'
* @param {Number} gen: current generation
* @param {Number} p1: payoff
* @param {Number} e1: error
* @param {Number} f1: fitness
* @returns {Object} new classifier
**/
const newClassifier = ({ condition, action, gen, p1=10.0, e1=0.0, f1=10.0 }) => {
  try {
    return {
      condition,
      action,
      lastTime: gen,
      pred: p1,
      error: e1,
      fitness: f1,
      exp: 0.0,
      setSize: 1.0,
      num: 1.0
    }
  } catch (e) {
    throw new Error(`New classifier: ${e}`)
  }
}
/**
* copyClassifier: Copies an existing classifier
* @param {Object} parent: parent classifier
* @returns {Object} new classifier
**/
const copyClassifier = (parent) => {
  try {
    return {
      ...parent,
      num: 1.0,
      exp: 0.0
    }
  } catch (e) {
    throw new Error(`Copy classifier: ${e}`)
  }
}
/**
* calculateDeletionVote: calculates the vote on whether a classifier should be
  deleted; based on fitness and num values
* @param {Object} classifier: classifier to vote on
* @param {Array} pop: population of candidate solutions
* @param {Number} delThresh: delete threshold
* @param {Number} fThresh: fitness threshold
* @returns {Number} vote
**/
const calculateDeletionVote = ({ classifier, pop, delThresh, fThresh=0.1 }) => {
  try {
    const vote = classifier.setSize * classifier.num
    const total = pop.reduce((acc, cur) => { return acc + cur.num },0)
    const avgFitness = pop.reduce((acc, cur) => {
      return acc + cur.fitness / total
    },0)
    const derated = classifier.fitness / Number(classifier.num)
    if (classifier.exp > delThresh && derated < (fThresh * avgFitness)) {
      return vote * (avgFitness / derated)
    }
    return vote
  } catch (e) {
    throw new Error(`Calculate deletion vote: ${e}`)
  }
}
/**
* deleteFromPop: deletes a solution from the population
* @param {Array} pop: population of candidate solutions
* @param {Number} popSize: size of population
* @param {Number} delThresh: delete threshold
* @returns
**/
const deleteFromPop = ({ pop, popSize, delThresh=20.0 }) => {
  try {
    const total = pop.reduce((acc, cur) => { return acc + cur.num },0)
    if (total <= popSize) return
    pop = pop.map((c,i) => {
      return {
        ...c,
        dvote: calculateDeletionVote({ classifier: c, pop, delThresh })
      }
    })
    const point = Math.random() * pop.reduce((acc, cur) => { return acc + cur.dvote },0)
    let index = 0
    let voteSum = 0.0
    for (let i = 0; i < pop.length; i++) {
      voteSum += pop[i].dvote
      if (voteSum >= point) {
        index = i
        break
      }
    }
    if (pop[index].num > 1) pop[index].num -= 1
    else pop = pop.filter((c,i) => i !== index)

  } catch (e) {
    throw new Error(`Delete from pop: ${e}`)
  }
}
/**
* generateRandomClassifier: generates a random classifier
* @param {Array} input: random bitstring
* @param {Array} actions: 0,1
* @param {Number} gen: current generation
* @param {Number} rate
* @returns {Object} new randomized classifier
**/
const generateRandomClassifier = ({ input, actions, gen, rate=1.0/3.0 }) => {
  try {
    let condition = input.map((i) => {
      if (Math.random() < rate) return '#'
      return i.toString()
    })
    let action = actions[randomInteger(actions.length-1)]
    return newClassifier({ condition, action, gen })
  } catch (e) {
    throw new Error(`Generate random classifier: ${e}`)
  }
}
/**
* doesMatch: checks whether the input matches the condition
* @param {Array} input: random bitstring
* @param {Array} condition: 0,1,#
* @returns {Boolean} true or false based on match
**/
const doesMatch = ({ input, condition }) => {
  try {
    for (let i = 0; i < input.length; i++) {
      if (condition[i].toString() !== '#' &&
        input[i].toString() !== condition[i].toString()) return false
    }
    return true
  } catch (e) {
    throw new Error(`Does match: ${e}`)
  }
}
/**
* getActions: Gets all the unique actions from the population
* @param {Array} pop: population of matched candidate solutions
* @returns {Array} all unique actions from population
**/
const getActions = (pop) => {
  try {
    let actions = []
    pop.map((c) => {
      if (!actions.includes(c.action)) actions.push(c.action)
      return c
    })
    return actions
  } catch (e) {
    throw new Error(`Get actions: ${e}`)
  }
}
/**
* generateMatchSet: Generates a matching set of classifiers in a pop
* @param {Array} input: random bitstring
* @param {Array} pop: population of candidate solutions
* @param {Array} allActions: all actions from the pop
* @param {Number} gen: current generation
* @param {Number} popSize: size of population
* @returns {Array} matchSet: set of classifiers
**/
const generateMatchSet = ({ input, pop, allActions, gen, popSize }) => {
  try {
    let matchSet = pop.filter((c) => doesMatch({ input, condition: c.condition }))
    let actions = getActions(matchSet)
    do {
      let remaining = arrayDifference({ arr1: allActions, arr2: actions })
      let classifier = generateRandomClassifier({
        input,
        actions: remaining,
        gen
      })
      pop.push(classifier)
      matchSet.push(classifier)
      deleteFromPop({ pop, popSize })
      actions.push(classifier.action)
    } while (actions.length < allActions.length)
    return matchSet
  } catch (e) {
    throw new Error(`Generate match set: ${e}`)
  }
}
/**
* generatePrediction: Generates a prediction to the classifier
* @param {Array} matchSet: matching set of classifiers in pop
* @returns {Object} prediction
**/
const generatePrediction = (matchSet) => {
  try {
    let pred = {}
    matchSet.map((classifier) => {
      let key = classifier.action
      if (pred[key] === null || pred[key] === undefined) pred[key] = { sum: 0, count: 0, weight: 0 }
      pred[key].sum += classifier.pred * classifier.fitness
      pred[key].count += classifier.fitness
      return classifier
    })
    for (let key in pred) {
      pred[key].weight = 0
      if (pred[key].count > 0) pred[key].weight = pred[key].sum / pred[key].count
    }
    return pred
  } catch (e) {
    throw new Error(`Generate prediction: ${e}`)
  }
}
/**
* selectAction: selects an action from the predictions
* @param {Array} predictions: set of preditions from the population
* @param {Boolean} pExplore: explore a random action?
* @returns {Object} smallest weight key
**/
const selectAction = ({ predictions, pExplore=false }) => {
  try {
    let keys = []
    for (let key in predictions) keys.push(key)
    keys = keys.sort((a,b) => {
      if (predictions[a].weight < predictions[b].weight) return -1
      if (predictions[a].weight > predictions[b].weight) return 1
      return 0
    })
    if (pExplore) return keys[randomInteger(keys.length-1)]
    return keys[0]
  } catch (e) {
    throw new Error(`Select action: ${e}`)
  }
}
/**
* updateSet: Updates action set values
* @param {Array} actionSet: set of actions from preditions
* @param {Number} reward: reward value for correct/likely prediction
* @returns
**/
const updateSet = ({ actionSet, reward, beta=0.2 }) => {
  try {
    let sum = actionSet.reduce((acc, cur) => { return acc + cur.num },0)
    for (let c of actionSet) {
      c.exp += 1
      if (c.exp < 1.0 / beta) {
        c.error = (c.error * (c.exp - 1.0) + Math.abs(reward - c.pred)) / c.exp
        c.pred = (c.pred * (c.exp - 1.0) + reward) / c.exp
        c.setSize = (c.setSize * (c.exp - 1.0) + sum) / c.exp
      } else {
        c.error += beta * (Math.abs(reward - c.pred) - c.error)
        c.pred += beta * (reward - c.pred)
        c.setSize += beta * (sum - c.setSize)
      }
    }
    return
  } catch (e) {
    throw new Error(`Update set: ${e}`)
  }
}
/**
* updateSet: Updates fitness of actions
* @param {Array} actionSet: set of actions from preditions
* @param {Number} minError: minimum error allowable
* @param {Number} lRate: learning rate
* @param {Number} alpha:
* @returns
**/
const updateFitness = ({ actionSet, minError=10, lRate=0.2, alpha=0.1,
  v=-5.0 }) => {
  try {
    let sum = 0
    let acc = new Array(actionSet.length).fill(0)
    actionSet.map((c,i) => {
      acc[i] = (c.error < minError) ? 1.0 : alpha * Math.pow((c.error / minError),v)
      sum += acc[i] * Number(c.num)
      return c
    })
    actionSet = actionSet.map((c,i) => {
      c.fitness += lRate * ((acc[i] * Number(c.num)) / sum - c.fitness)
      return c
    })
  } catch (e) {
    throw new Error(`Update fitness: ${e}`)
  }
}
/**
* canRunGeneticAlgorithm: Determines if the ga will run
* @param {Array} actionSet: set of actions from preditions
* @param {Number} gen: current generation
* @param {Number} gaFreq: frequency of running the GA
* @returns {Boolean} true or false
**/
const canRunGeneticAlgorithm = ({ actionSet, gen, gaFreq }) => {
  try {
    if (actionSet.length <= 2) return false
    const total = actionSet.reduce((acc, cur) => { return acc + cur.lastTime * cur.num },0)
    const sum = actionSet.reduce((acc, cur) => { return acc + cur.num },0)
    if (gen - (total / sum) > gaFreq) return true
    return false
  } catch (e) {
    throw new Error(`Can run genetic algorithm?: ${e}`)
  }
}
/**
* mutation: determines if a mutation will take place based on rate
* @param {Object} cl: current classifier
* @param {Array} actionSet: set of actions from preditions
* @param {Array} input: random bitstring
* @param {Number} rate: mutation rate
* @returns
**/
const mutation = ({ cl, actionSet, input, rate=0.04 }) => {
  try {
    for (let i = 0; i < cl.condition.length; i++) {
      if (Math.random() < rate) {
        if (cl.condition[i] === '#') cl.condition[i] = input[i]
        else cl.condition[i] = '#'
      }
    }
    if (Math.random() < rate) {
      let subset = arrayDifference({ arr1: actionSet, arr2: [...cl.action] })
      cl.action = subset[randomInteger(subset.length-1)]
    }
  } catch (e) {
    throw new Error(`Mutation: ${e}`)
  }
}
/**
* uniformCrossover: Cross parents at a 50% chance of crossover
* @param {Array} parent1
* @param {Array} parent2
* @returns {Array} child
**/
const uniformCrossover = ({ parent1, parent2 }) => {
  try {
    let child = []
    parent1.map((c,i) => {
      if (Math.random() < 0.5) child.push(parent1[i].toString())
      else child.push(parent2[i].toString())
      return c
    })
    return child
  } catch (e) {
    throw new Error(`Uniform crossover: ${e}`)
  }
}
/**
* insertInPop: Inserts a classifier to the population if conditions are not met
* @param {Object} cla: classifier to be added
* @param {Array} pop: population of candidate classifiers
* @returns
**/
const insertInPop = ({ cla, pop }) => {
  try {
    for (let c of pop) {
      if (cla.condition === c.condition && cla.action === c.action) {
        c.num += 1
        return
      }
    }
    pop.push(cla)
    return
  } catch (e) {
    throw new Error(`Insert in pop: ${e}`)
  }
}
/**
* crossover: crosses two parent classifier solutions
* @param {Object} c1: classifier 1
* @param {Object} c2: classifier 2
* @param {Object} p1: parent classifier 1
* @param {Object} p2: parent classifier 2
* @returns
**/
const crossover = ({ c1, c2, p1, p2 }) => {
  try {
    c1.condition = uniformCrossover({
      parent1: p1.condition,
      parent2: p2.condition
    })
    c2.condition = uniformCrossover({
      parent1: p1.condition,
      parent2: p2.condition
    })
    c1.pred = (p1.pred + p2.pred) / 2.0
    c2.pred = (p1.pred + p2.pred) / 2.0
    c1.error = 0.25 * (p1.error + p2.error) / 2.0
    c2.error = 0.25 * (p1.error + p2.error) / 2.0
    c1.fitness = 0.1 * (p1.fitness + p2.fitness) / 2.0
    c2.fitness = 0.1 * (p1.fitness + p2.fitness) / 2.0
    return
  } catch (e) {
    throw new Error(`Crossover: ${e}`)
  }
}
/**
* runGA: runs the genetic algorithm on a set of classifers
* @param {Array} actions: 0,1
* @param {Array} pop: population of candidate classifiers
* @param {Array} actionSet: set of classifiers from preditions
* @param {Array} input: random bitstring
* @param {Number} gen: current generation
* @param {Number} popSize: size of population
* @param {Number} cRate: crossover rate
* @returns
**/
const runGA = ({ actions, pop, actionSet, input, gen, popSize, cRate=0.8 }) => {
  try {
    let p1 = binaryTournament(actionSet)
    let p2 = binaryTournament(actionSet)
    let c1 = copyClassifier(p1)
    let c2 = copyClassifier(p2)
    if (Math.random() < cRate) crossover({ c1, c2, p1, p2 })
    mutation({ cl: c1, actionSet: actions, input })
    insertInPop({ cla: c1, pop })
    mutation({ cl: c2, actionSet: actions, input })
    insertInPop({ cla: c2, pop })

    while (pop.reduce((acc, cur) => { return acc + cur.num },0) > popSize) {
      deleteFromPop({ pop, popSize })
    }
    return
  } catch (e) {
    throw new Error(`Run GA: ${e}`)
  }
}
/**
* trainModel: trains the classification model
* @param {Number} popSize: size of population
* @param {Number} maxGens: max number of generations
* @param {Array} actions: 0,1
* @param {Number} gaFreq: frequency of running the GA
* @returns
**/
const trainModel = ({ popSize, maxGens, actions, gaFreq }) => {
  try {
    let pop = []
    let perf = []
    for (let gen = 0; gen < maxGens; gen++) {
      let explore = gen % 2 === 0
      let input = randomBitstring(6)
      let matchSet = generateMatchSet({
        input,
        pop,
        allActions: actions,
        gen,
        popSize
      })
      let predArray = generatePrediction(matchSet)
      let action = selectAction({ predictions: predArray, pExplore: explore })
      let reward = (targetFunction(input) === Number(action)) ? 1000 : 0
      if (explore) {
        let actionSet = matchSet.filter((c) => c.action === action)
        updateSet({ actionSet, reward })
        updateFitness({ actionSet })
        if (canRunGeneticAlgorithm({ actionSet, gen, gaFreq })) {
          for (let c of actionSet) c.lastTime = gen
          runGA({ actions, pop, actionSet, input, gen, popSize })
        }
      } else {
        let e = Math.abs(predArray[action].weight - reward)
        let a = (reward === 1000) ? 1 : 0
        perf.push({ error: e, correct: a })
        if (perf.length >= 50) {
          let err = Math.round(perf.reduce((acc, cur) => {
            return acc + cur.error
          },0) / perf.length)
          let acc = perf.reduce((acc, cur) => {
            return acc + cur.correct
          },0) / perf.length
          console.log(`> Generation: ${gen+1}, Size: ${pop.length}, Error: ${err}, Acc: ${acc}`)
          perf = []
        }
      }
    }
    return pop
  } catch (e) {
    throw new Error(`Train model: ${e}`)
  }
}
/**
* testModel: Tests the classification model
* @param {Number} system: trained model
* @param {Number} numTrials: number of trials
* @returns {Number} correct: number of correct trials
**/
const testModel = ({ system, numTrials=50 }) => {
  try {
    let correct = 0
    for (let i = 0; i < numTrials; i++) {
      let input = randomBitstring(6)
      let matchSet = system.filter((c) => doesMatch({ input, condition: c.condition }))
      let predArray = generatePrediction(matchSet)
      let action = selectAction({ predictions: predArray, pExplore: false })
      if (targetFunction(input) === Number(action)) correct += 1
    }
    console.log(`Done! Classified correctly: ${correct}/${numTrials}`)
    return correct
  } catch (e) {
    throw new Error(`Test model: ${e}`)
  }
}
/**
* execute: executes the classifier
* @param {Number} popSize: size of population
* @param {Number} maxGens: max number of generations
* @param {Array} actions: 0,1
* @param {Number} gaFreq: frequency of running the GA
* @returns {Array} system: trained classifier
**/
const executeLearningClassifier = ({ popSize, maxGens, actions, gaFreq }) => {
  try {
    let system = trainModel({ popSize, maxGens, actions, gaFreq })
    let correct = testModel({ system })
    return system
  } catch (e) {
    throw new Error(`Execute: ${e}`)
  }
}

module.exports = { executeLearningClassifier }

/* END */
