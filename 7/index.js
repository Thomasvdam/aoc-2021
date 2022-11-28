const { getInput } = require('../setup');

function processLine(line) {
    return line.split(',').map(Number);
}

function getAlignCostSimple(crabs, position) {
    return crabs.reduce((acc, curr) => {
        return acc + Math.abs(curr - position);
    }, 0);
}

function partOne(crabs) {
    const maxPos = Math.max(...crabs);
    const posCosts = [];
    for (let index = 0; index <= maxPos; index++) {
        posCosts.push(getAlignCostSimple(crabs, index));
    }

    const lowestCost = Math.min(...posCosts);
    return lowestCost;
}

function getAlignCostComplex(crabs, position) {
    return crabs.reduce((acc, curr) => {
        const steps = Math.abs(curr - position);
        const fuelCost = steps * (steps + 1) / 2;
        return acc + fuelCost;
    }, 0);
}

function partTwo(crabs) {
    const maxPos = Math.max(...crabs);
    const posCosts = [];
    for (let index = 0; index <= maxPos; index++) {
        posCosts.push(getAlignCostComplex(crabs, index));
    }

    const lowestCost = Math.min(...posCosts);
    return lowestCost;
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine)[0];

    const answerOne = partOne(data);
    console.log('[DEBUG]: answerOne ::: ', answerOne);

    const answerTwo = partTwo(data);
    console.log('[DEBUG]: answerTwo ::: ', answerTwo);
});
