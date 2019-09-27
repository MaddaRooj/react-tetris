import {useState, useCallback} from 'react';

import {TETROMINOS, randomTetromino} from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        position: {x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const rotate = (matrix, direction) => {
        //Make the rows into columns
        const rotatedTetromino = matrix.map((_, index) => matrix.map(column => column[index]));
        //Reverse each row to get a rotated tetromino
        if(direction > 0) return rotatedTetromino.map(row => row.reverse());
        return rotatedTetromino.reverse();
    }

    const playerRotate = (stage, direction) => {
        //Copy the player currently in the state
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        //Rotate the clonedPlayer
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);

        const position = clonedPlayer.position.x;
        let offset = 1;
        while(checkCollision(clonedPlayer, stage, {x: 0, y: 0})){
            clonedPlayer.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if(offset > clonedPlayer.tetromino[0].length){
                rotate(clonedPlayer.tetromino, -direction);
                clonedPlayer.position.x = position;
                return;
            }
        }
        //Reset the player to the clonedPlayer
        setPlayer(clonedPlayer);
    };

    const updatePlayerPos = ({x, y, collided}) => {
        setPlayer(previous => ({
            ...previous,
            position: {x: (previous.position.x += x), y: (previous.position.y += y)},
            collided
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            position: {x: STAGE_WIDTH / 2 - 2, y: 0},
            tetromino: randomTetromino().shape,
            collided: false
        });
    }, [])

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}