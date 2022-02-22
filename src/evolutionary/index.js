/*******************************************************************************
** Evolutionary Algorithms **
Genetic Algorithm
*******************************************************************************/
const { geneticAlgorithmSearch } = require('./genetic_algorithm')
const { evolutionaryStrategySearch } = require('./evolution_strategies')
const { differentialEvolutionSearch } = require('./differential_evolution')
const { evolutionaryProgrammingSearch } = require('./evolutionary_programming')
const { executeLearningClassifier } = require('./learning_classifier_system')
const { nonDominatedGASearch } = require('./nondominated_sorting_genetic_algorithm')

module.exports = {
  differentialEvolutionSearch,
  evolutionaryProgrammingSearch,
  evolutionaryStrategySearch,
  executeLearningClassifier,
  geneticAlgorithmSearch,
  nonDominatedGASearch
}


/* END */
