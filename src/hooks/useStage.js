import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        // Pass the stage into the function
        // Use the reduce method on the stage in order to create a new array,
        // Check if the row contains a '0' in which it is not clear
        // If there is a full row, add row to rowsCleared 
        // Then add new empty row at the top of stage and return accumulated array
        const sweepRows = newStage => 
            newStage.reduce((accumulator, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    accumulator.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return accumulator;
                }
                accumulator.push(row);
                return accumulator;
            }, []);

        const updateStage = prevStage => {
            //First flush stage
            const newStage = prevStage.map(row =>
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
            );

            //Then draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newStage[y + player.position.y][x + player.position.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });
            // Check if we collided
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            };
            return newStage;
        };

        setStage(prev => updateStage(prev));
    }, [player.collided, player.position.y, player.position.x, player.tetromino, resetPlayer]);

    return [stage, setStage, rowsCleared];
}