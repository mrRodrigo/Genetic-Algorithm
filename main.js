const Point = require('./Point');
const { printMazePath } = require('./Console');
const { randomInteger } = require('./Math');


let MAX_ITERATION = 39;
let INIT_STEPS = 10;
let POPULATION = 5;

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
  if (typeof position != Object) position = position.slice(-1)[0];
  Math.abs(position.x - endMaze.x) + Math.abs(position.y - endMaze.y);
};

const isWalkable = (x, y) => {
  // 0 not have wall, so return true
  // 1 have one wall, so return false
  return !maze[y][x];
};

const possiblePositionsToGo = currentPosition => {
  const { x, y } = currentPosition;
  const possiblePositions = [];

  // apply one step for all possible positions
	const	UP = y - 1;
	const DOWN = y + 1;
	const RIGHT = x + 1;
  const LEFT = x - 1;
  
  // check limits of maze and positions that not have one wall
  const myUP = UP > -1 && isWalkable(x, UP);
	const myDOWN = DOWN < mazeSize && isWalkable(x, DOWN);
	const myRIGHT = RIGHT < mazeSize && isWalkable(RIGHT, y);
  const myLEFT = LEFT > -1 && isWalkable(LEFT, y);

  // all true positions add to array of possible positions
	if(myUP) possiblePositions.push(new Point(x, UP));
  if(myDOWN) possiblePositions.push(new Point(x, DOWN));
	if(myRIGHT) possiblePositions.push(new Point(RIGHT, y));
	if(myLEFT) possiblePositions.push(new Point(LEFT, y));


  return possiblePositions;
};

const randomPath = (size, position) => {
  const path = [new Point(position.x, position.y)];

  for(let i = 1; i <= size; i++ ){
    const possiblePaths = possiblePositionsToGo(path[i - 1]);
    //const bestPosition = possiblePaths.sort((a, b) => fitness(a) - fitness(b))
    const randomPath = possiblePaths[randomInteger(0, possiblePaths.length - 1)];
    path.push(randomPath);
  }

  return path;
};


const initPopulation = (size) => {
  const population = [];
  for(let i = 1; i <= size; i++ ){
    const path = randomPath(INIT_STEPS, initMaze);
    population.push(path);
  }
  return population;
};

const tournament = (population) => {
  const rndX = randomInteger(0, POPULATION - 1);
  const rndY = randomInteger(0, POPULATION - 1);

  const x = population[rndX];
  const y = population[rndY];

  return (fitness(x) > fitness(y)) ? x : y;
};

const crossOver = (population, nextPopulation = []) => {
  const parentOne = tournament(population);
  const parentTwo = tournament(population);

  for(let i = 0; i < POPULATION-1; i++){
    nextPopulation[i] = parentOne;
    nextPopulation[i+1] = parentTwo;
  }
  return nextPopulation;

};

const mutateIndividual = (individual) => {
  // taxa de mutação 50%
  const pointToCut = individual.length / 2;

  const preserve = individual.slice(0, pointToCut);
  const modify = individual.slice(pointToCut);

  const newPaths = randomPath(individual.length - pointToCut, modify[0]);
  
  preserve.push(newPaths);

  return preserve; 
};

const mutate = (population) => {
  for(let i = 0; i < POPULATION; i++){
    population[i] = mutateIndividual(population[i]);
  }
};


let population = initPopulation(POPULATION);

while(MAX_ITERATION){
  // // sort all population by fitness for each individual
  // const bestPosition = population.sort((a, b) => fitness(a) - fitness(b));
  // //console.log(bestPosition)

  const nextPopulation = crossOver(population);

  // if(MAX_ITERATION % 2 == 0) {
  //   mutate(nextPopulation);
  // }

  population = nextPopulation;
  console.log('-----');
  printMazePath(nextPopulation[0], maze, 11);
  printMazePath(population[0], maze, 11);

  MAX_ITERATION--;
}


console.log(population)
// const path = randomPath(1000, initMaze);



