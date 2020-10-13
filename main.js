const Point = require('./Point');
const { printMazePath } = require('./Console');
const { randomInteger } = require('./Math');


let MAX_ITERATION = 50;
let POPULATION = 2;

const initMaze = new Point(0,0);
const endMaze = new Point(11,11);
const mazeSize = 12;

const maze = [ 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
];



const fitness = position  => { 
    if(!position) return;
    if (typeof position != 'Object') position = position.slice(-1)[0];
    return Math.abs(position.x - endMaze.x) + Math.abs(position.y - endMaze.y);
};

const isWalkable = (x, y) => {
    // 0 not have wall, so return true
    // 1 have one wall, so return false
    return !maze[y][x];
};

const isValidPath = (path) => {
  const { x, y } = path;

  if (y > -1 && x > - 1 && y < mazeSize && x < mazeSize && isWalkable(x, y))
    return true;

  return false;
};

const hasDirectionToGo = (currentPosition) => {
    const { x, y } = currentPosition;

    // apply one step for all possible positions
    const	UP = y - 1;
    const DOWN = y + 1;
    const RIGHT = x + 1;
    const LEFT = x - 1;
    
    // check limits of maze and positions that not have one wall
    const myUP = UP > -1 && isWalkable(x, UP)
    const myDOWN = DOWN < mazeSize && isWalkable(x, DOWN)
    const myRIGHT = RIGHT < mazeSize && isWalkable(RIGHT, y)
    const myLEFT = LEFT > -1 && isWalkable(LEFT, y)

    const possiblePaths = [myUP, myDOWN, myRIGHT, myLEFT];

    return possiblePaths.some(e => e === true);
};

const randomDirection = (individual) => {
  const { x, y } = individual.slice(-1)[0];

  // apply one step for all possible positions
  const	UP = y - 1;
  const DOWN = y + 1;
  const RIGHT = x + 1;
  const LEFT = x - 1;
  
  const possiblePositions = [new Point(x, UP), new Point(x, DOWN), new Point(RIGHT, y), new Point(LEFT, y)];
  
  const validPositions = possiblePositions.filter( 
    pp => !individual.some(p => p.x == pp.x && p.y == pp.y)
  )
  
  return validPositions[randomInteger(0, validPositions.length - 1)];
};

const generateRandomPath = (individual = []) => {
    if(individual.length <= 0)
      individual.push(new Point(initMaze.x, initMaze.y))

    if(hasDirectionToGo(individual.slice(-1)[0])){
      const path = randomDirection(individual);

      if(isValidPath(path))
          individual.push(path);
      else return //dead

      generateRandomPath(individual);
    }
};

const tournament = (population) => {
  const rndX = randomInteger(0, POPULATION - 1);
  const rndY = randomInteger(0, POPULATION - 1, rndX);

  const x = population[rndX];
  const y = population[rndY];

  return fitness(x) < fitness(y) ? x : y;
};

const crossOver = (population, nextPopulation = []) => {
  const parentOne = tournament(population);
  const parentTwo = tournament(population);

  // const elitism = population.sort((a, b) => fitness(a) - fitness(b))[0];
  // nextPopulation[0] = elitism;

  for(let i = 0; i < POPULATION-1; i++){
      nextPopulation[i] = parentOne;
      nextPopulation[i+1] = parentTwo;
  }
  return nextPopulation;
};


const mutateIndividual = (individual) => {
  if(individual.length > 1){
    const pointToCut = individual.length / 2;

    const preserve = individual.slice(0, pointToCut);
    const modify = individual.slice(pointToCut);

    const newPaths = generateRandomPath(modify);
    
    preserve.concat(newPaths);

    return preserve; 
  }
  return individual;
};


const mutate = (populationToMutate) => {
  for(let i = 0; i < POPULATION; i++ ){
    populationToMutate[i] = mutateIndividual(populationToMutate[i]);
  }
  return populationToMutate;
};

const initPopulation = () => {
    const population = [];
    for(let i = 0; i < POPULATION; i++ ){
        const path = [];
        generateRandomPath(path);
        population[i] = path;
    }
    return population;
}

let population = initPopulation();

for(let GENERATION = 0; GENERATION < MAX_ITERATION; GENERATION++ ){
  if(GENERATION != 0){
    let nextPopulation = crossOver(population);

    for(let i = 0; i < POPULATION; i++ ){
      const path = nextPopulation[i];
      generateRandomPath(path);
    }
    
    // if (GENERATION % 2 === 0)
    //   nextPopulation = mutate(nextPopulation);
  
    population = nextPopulation;
    console.log('=====');
    population.map(e => printMazePath(e, maze, 11));
  }else{
    console.log('===== ZERO');
    population.map(e => printMazePath(e, maze, 11));
  }
}
  