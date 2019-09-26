import {useState, useEffect} from 'react';
import {createStage} from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());

    useEffect(() => {
        const updateStage = prevStage => {
            //First flush stage
            const newStage = prevStage.map(row => 
                    row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
                );

            //Then draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if(value !== 0) {
                        newStage[y + player.position.y][x + player.position.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });

            return newStage;
        };

        setStage(prev => updateStage(prev))
    }, [player]);

    return [stage, setStage];
}