const randomInteger = (min, max, different) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rnd = Math.floor(Math.random() * (max - min + 1)) + min;

  if(different){
      if(rnd == different){
        return randomInteger(min, max, different)
      }else{
        return rnd;
      }
  }else{
    return rnd;
  }
}

module.exports = { randomInteger };