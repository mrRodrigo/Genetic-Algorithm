const Point = require('./Point');
const { printMazePath } = require('./Console');
const { randomInteger } = require('./Math');


let MAX_ITERATION = 200;

const initMaze = new Point(0,0);
const endMaze = new Point(11,11);
const mazeSize = 11;

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



const fitness = position  => Math.abs(position.x - endMaze.x) + Math.abs(position.y - endMaze.y);

const isWalkable = (x, y) => {
  // 0 not have wall, so return true
  // 1 have one wall, so return false
  return !maze[y][x];
}

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
    const randomPath = possiblePaths[randomInteger(0, possiblePaths.length - 1)]
    path.push(randomPath)
  }

  return path;
}

const path = randomPath(1000, initMaze);
printMazePath(path, maze, 11);



