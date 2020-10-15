const { randomInteger } = require('./math');

const NUMBER_OF_MOVEMENT = 144;
const MAX_ITERATION = 10000;
const POPULATION = 300;
const MUTATION = 8;


// const maze = [
//   [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
//   [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
//   [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 3, 0, 1, 0, 1, 1],
//   [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
//   [1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
//   [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
//   [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
//   [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0],
//   [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
//   [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
// ];


const maze = [
  [2, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 3],
  [1, 1, 1, 0, 0, 0]
];



const comparator = (a,b) => {
  if (a[0] < b[0])
    return -1;
  if (a[0] > b[0])
    return 1;
  return 0;
}

const findPos = (maze, el) => {
  var i = 0,
      index;
  for (; i < maze.length; i++) {
      index = maze[i].indexOf(el);
      if (index > -1) {
          return [i, index];
      }
  }
}

const makeChromosome = () => {
  let chromosome = '';
  for (var i = 0; i < NUMBER_OF_MOVEMENT; i++) {
      chromosome += String(Math.floor(Math.random() * 4));
  }
  //return [<aptidao>, <caminho>]
  return [null, chromosome];
}

const makePopulation = (sizeOfPopulation) => {
  const population = [];
  for (var i = 0; i < sizeOfPopulation; i++) {
      population.push(makeChromosome());
  }
  return population;
}

const didPlayerHitWall = (el) => {
  return el === 1;
}

const didPlayerHitFinish = (el) => {
  return el === 3;
}

const didPlayerCanMove = (maze, direction, pos) => {
  var row = maze.length,
      column = maze[0].length;
  switch (direction) {
      case '0':
          return pos[0] - 1  > -1;

      case '1':
          return pos[1] + 1 < column;

      case '2':
          return pos[0] + 1 < row;

      case '3':
          return pos[1] - 1 > -1;
  }
}

const move = (maze, direction, pos) => {
  var isOver = false,
      penalty = 0,
      newPos = pos;
  if (!didPlayerCanMove(maze, direction, pos)) {
      return [pos, 1, isOver];
  } else {
      switch (direction) {
          case '0':
              newPos[0] = newPos[0] - 1;
              didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
              break;

          case '1':
              newPos[1] = newPos[1] + 1;
              didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
              break;

          case '2':
              newPos[0] = newPos[0] + 1;
              didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
              break;

          case '3':
              newPos[1] = newPos[1] - 1;
              didPlayerHitWall(maze[newPos[0]][newPos[1]]) ? penalty++ : 0;
              break;
      }
  }

  isOver = didPlayerHitFinish(maze[pos[0]][pos[1]]);
  
  return [newPos, penalty, isOver];
}

const evaluation = (maze, chromosome) => {

    let penalties = 0,
        initialPosition = findPos(maze, 2), //
        finishPosition = findPos(maze, 3)

      for (let i = 0; i < chromosome.length; i++) {
        const resultOfMove = move(maze, chromosome[i], initialPosition);
        initialPosition = resultOfMove[0];
        penalties += resultOfMove[1];
  
        // se chegou no final corta o caminho dele até o final
        if (resultOfMove[2]) {
            chromosome = chromosome.substr(0, i + 1);
            break;
        }
    }

  const score = Math.abs((finishPosition[0] - initialPosition[0]) + (finishPosition[1] - initialPosition[1])) + penalties;
  return [score, chromosome];
};

const calculateScoreOfPopulation = (population, maze) => {
  const newPop = [];

  population.map(chromosome => {
      newPop.push(evaluation(maze, chromosome[1]));
  }) 

  return newPop;
}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

const mutate = (chromosome) => {
  const rndPath = randomInteger(0, 3);

  for (var i = 0; i < 2; i++) {
    chromosome[1] = setCharAt(chromosome[1], randomInteger(0, chromosome[1].length), rndPath);
  }

  return chromosome;
}

const mutation = (populationToMutate, generation) => {
  const population = [];
  if(generation % MUTATION == 0){
    for (var i = 0; i < POPULATION; i++) {
      population[i] = mutate(populationToMutate[i]);
    }
    console.log('mutation');
    return population;
  }else{
    return populationToMutate;
  }
};

const crossover = (parent1, parent2) => {
  const [,pathFromParent1] = parent1;
  const [,pathFromParent2] = parent2;
  const CUT_IN = 5;

  const minimum = 
      pathFromParent1.length < pathFromParent2.length 
      ? pathFromParent1.length 
      : pathFromParent2.length;

  const cut = Math.floor(minimum / 3);

  const child1 = [null, pathFromParent1.substr(0, cut) + pathFromParent2.substr(cut, cut * 2) + pathFromParent1.substr(cut * 2)];
  const child2 = [null, pathFromParent2.substr(0, cut) + pathFromParent1.substr(cut, cut * 2) + pathFromParent2.substr(cut, cut * 2)];

  return [child1, child2];
}

const tournament = (population) => {
  const rndX = randomInteger(0, POPULATION - 1);
  const rndY = randomInteger(0, POPULATION - 1, rndX);

  const x = population[rndX];
  const y = population[rndY];

  return x[0] < y[0] ? x : y;
}

const selection = (population) => {
  const parent1 = tournament(population);
  const parent2 = tournament(population);
  return [parent1, parent2];
}

const nextGeneration = (population) => {
  const nextPopulation = [];

  for (var i = 0; i < POPULATION/2; i++) {
      const [parent1, parent2] = selection(population);
      const [child1, child2] = crossover(parent1, parent2);
      nextPopulation.push(child1, child2);
  }

  return nextPopulation;
}

var translateSolution = function (solution) {
  var translation = [];
  for (i = 0; i < solution[1].length; i++) {
      switch (solution[1][i]) {
          case '0':
              translation.push('↑');
              break;

          case '1':
              translation.push('→');
              break;

          case '2':
              translation.push('↓');
              break;

          case '3':
              translation.push('←');
              break;
      ;}
  }

  return translation.join('  ');
}

let population = makePopulation(POPULATION);

for (let i = 0; i < MAX_ITERATION; i++) {

  const scoredPopulation = calculateScoreOfPopulation(population, maze).sort(comparator);
  const [bestFit] = scoredPopulation;

  // verifica se score é zero, ou seja se chegou ao final
  const [score] = bestFit;

  if (score === 0) {
      console.log(`PATH FOUND ON GENERATION ${i}`);
      console.log(translateSolution(bestFit));
      break;
  }

  const nextGen = nextGeneration(scoredPopulation);

  population = mutation(nextGen, i);
  console.log(`BEST OF GENERATION  ${i}  FITNESS: ${score}`);
  console.log(translateSolution(bestFit));
};




