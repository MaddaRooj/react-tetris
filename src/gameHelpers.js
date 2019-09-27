export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  )

export const checkCollision = (player, stage, { x: moveX, y: moveY}) => {
  for(let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on a Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if(
          //2. Check that our move is inside the game areas height (y)
          //We shouldn't go through the bottom of the stage
          !stage[y + player.position.y + moveY] || 
          //3. Check that our move is inside the game areas width (x)
          !stage[y + player.position.y + moveY][x + player.position.x + moveX] || 
          //4. Check that the cell we move to is not set to clear
          stage[y + player.position.y + moveY][x + player.position.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
}
