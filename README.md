# 🤖 Clever Algorithms by Dr. Jason Brownlee
A library for testing various nature inspired algorithms to solve different problem sets.
All code written in Javascript; to be executed within a Node/Browser environment.

## Motivation
This project was motivated by a desire to pick up machine learning algorithms as well as
learn the Ruby programming language by way of translation to Javascript. While several of
the following algorithms can be found in existing libraries and other code bases, building
the algorithm from scratch can serve as an excellent educational exercise. Some of the algorithms
contained are difficult to find and would effectively require reading through the original
white-paper or other academic journals that described them. Within the Clever Algorithms book,
all original code examples can be found written in the Ruby programming language.

## Installation

##### NodeJS
+ [NodeJS Homepage](https://nodejs.org/en/)
+ [Node Version Manager](https://github.com/nvm-sh/nvm)

Current LTS v16.13.2

Recommendation is to install the Node Version Manager and install Nodejs through this version manager

From the command line(Linux/Mac):
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm
nvm install v16.13.2
```
## Problems
Each algorithm tackles a specific problem and can be extended to be applied to a variety
of situations. The problems tackled in the book are the following:

### Continuous Function Optimization
Seeking a minimum set of values given an objective function. See utils.js.
&#402;(x) where f = &#8721;<sub>i=1</sub>  -5.0 &#8924; x<sub>i</sub> &#8924; 5.0

#### Stochastic
* [Random Search](src/stochastic/random_search.js)
* [Adaptive Random Search](src/stochastic/adaptive_random_search.js)
* [Scatter Search](src/stochastic/scatter_search.js)

#### Evolutionary
* [Evolution Strategies](src/evolutionary/evolution_strategies.js)
* [Differential Evolution](src/evolutionary/differential_evolution.js)

### Binary String Optimization - One Max
Maximization problem to prepare a string of all '1' bits.

#### Stochastic
* [Stochastic Hill Climbing](src/stochastic/stochastic_hill_climbing.js)

#### Evolutionary
* [Genetic Algorithm](src/evolutionary/genetic_algorithm.js)

### Traveling Salesman Problem
Seeks a permutation of the order to visit cities that minimizes the total distance traveled.
Uses the Berlin52 data set.

#### Stochastic
* [Random Search](src/stochastic/random_search.js)
* [Adaptive Random Search](src/stochastic/adaptive_random_search.js)
* [Stochastic Hill Climbing](src/stochastic/stochastic_hill_climbing.js)
* [Iterated Local Search](src/stochastic/iterated_local_search.js)
* [Guided Local Search](src/stochastic/guided_local_search.js)
* [Variable Neighborhood Search](src/stochastic/variable_neighborhood_search.js)
* [Greedy Randomized Adaptive Search](src/stochastic/greedy_randomized_adaptive_search.js)
* [Scatter Search](src/stochastic/scatter_search.js)
* [Tabu Search](src/stochastic/tabu_search.js)
* [Reactive Tabu Search](src/stochastic/reactive_tabu_search.js)

## Usage
```javascript

```

## Algorithms

### Stochastic
Focuses on the introduction of randomness into heuristic methods
* [Random Search](src/stochastic/random_search.js)
* [Adaptive Random Search](src/stochastic/adaptive_random_search.js)
* [Stochastic Hill Climbing](src/stochastic/stochastic_hill_climbing.js)
* [Iterated Local Search](src/stochastic/iterated_local_search.js)
* [Guided Local Search](src/stochastic/guided_local_search.js)
* [Variable Neighborhood Search](src/stochastic/variable_neighborhood_search.js)
* [Greedy Randomized Adaptive Search](src/stochastic/greedy_randomized_adaptive_search.js)
* [Scatter Search](src/stochastic/scatter_search.js)
* [Tabu Search](src/stochastic/tabu_search.js)
* [Reactive Tabu Search](src/stochastic/reactive_tabu_search.js)

### Evolutionary
Inspired by evolution by means of natural selection
* [Genetic Algorithm](src/evolutionary/genetic_algorithm.js)
* [Evolution Strategies](src/evolutionary/evolution_strategies.js)
* [Differential Evolution](src/evolutionary/differential_evolution.js)

### Physical
Inspired by physical and social systems

### Probabilistic
Focuses on methods that build models and estimate distributions in search domains

### Swarm
Focuses on methods that exploit the properties of collective intelligence

### Immune
Inspired by the adaptive immune system of vertebrates

### Neural
Inspired by the plasticity and learning qualities of the human nervous system

## Contributing

## License
[Creative Commons Attribution-Noncommercial-Share Alike 2.5 Australia License](https://creativecommons.org/licenses/by-nc-sa/2.5/au/)
