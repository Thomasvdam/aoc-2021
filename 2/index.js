const { getInput } = require('../setup');

function processLine(line) {
    const [direction, distance] = line.split(' ');
    return { direction, distance: Number(distance) };
}

function executeOne(initialState, instructions) {
    return instructions.reduce((state, instruction) => {
        const { direction, distance } = instruction;
        switch (direction) {
            case 'forward':
                state.horizontal += distance;
                break;
            case 'down':
                state.depth += distance;
                break;
            case 'up':
                state.depth -= distance;
                break;
        }

        return state;
    }, initialState);
}

function executeTwo(initialState, instructions) {
    return instructions.reduce((state, instruction) => {
        const { direction, distance } = instruction;
        switch (direction) {
            case 'forward':
                state.horizontal += distance;
                state.depth += (distance * state.aim);
                break;
            case 'down':
                state.aim += distance;
                break;
            case 'up':
                state.aim -= distance;
                break;
        }
    
        return state;
    }, initialState);
}

getInput(rawData => {
    const instructions = rawData.split('\n').map(processLine);
    const endstateOne = executeOne({ horizontal: 0, depth: 0 }, instructions);
    console.log('[DEBUG]: endstateOne ::: ', endstateOne.horizontal * endstateOne.depth);

    const endStateTwo = executeTwo({ horizontal: 0, depth: 0, aim: 0 }, instructions);
    console.log('[DEBUG]: endStateTwo ::: ', endStateTwo.horizontal * endStateTwo.depth);
});
