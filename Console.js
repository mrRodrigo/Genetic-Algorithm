const printMazePath = (path, maze, size) => {

  for(let x = 0; x <= size; x++ ){
      let yLine = '';

      for(let y = 0; y <= size; y++ ){
        let room = '';

        if(path.find(e => e.x === y && e.y === x)){
          room = '\x1b[31m.';
        }else{
          room = '.';
        }

        if (maze[x][y]){
          yLine += `\x1b[40m ${room} \x1b[0m`;
        }else{
          yLine += `\x1b[47m ${room} \x1b[0m`;
        }
      }
      console.log(yLine);
  }
  console.log('\x1b[0m');
}

module.exports = { printMazePath };