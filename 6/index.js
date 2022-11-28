const { getInput } = require('../setup');

function processLine(line) {
    return line.split(',').map(Number);
}

function partOne(initialState, days) {
    const state = []
    for (let i = 0; i < 9; i++) {
        state.push(initialState.filter(c => c === i).length);
    }

    let day = 0;
    while (day < days) {
        const spawning = state.shift();
        state[8] = spawning;
        state[6] = state[6] + spawning;
        day++;
    }

    return state.reduce((acc, curr) => acc + curr);
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine)[0];
    const answerOne = partOne(data, 80);
    console.log('[DEBUG]: answerOne ::: ', answerOne);

    const answerTwo = partOne(data, 256);
    console.log('[DEBUG]: answerTwo ::: ', answerTwo);
});
