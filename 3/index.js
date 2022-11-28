const { getInput } = require('../setup');

function processLine(line) {
    return line.split('').map(Number);
}

function getBitOccurences(data) {
    return data.reduce(((acc, curr) => {
        curr.forEach((bit, index) => {
            if (!acc[index]){
                acc[index] = [0, 0];
            }
            acc[index][bit]++;
        });
        return acc;
    }), []);
}

function getPartOne(bitOccurences) {
    const gammaBin = bitOccurences.reduce((acc, curr) => {
        if (curr[0] > curr[1]) {
            return `${acc}0`;
        }
        return `${acc}1`;
    }, '');
    const epsilonBin = gammaBin.split('').map((bit) => {
        if (bit === '0') {
            return 1;
        }
        return 0;
    }).join('');

    const gamma = parseInt(gammaBin, 2);
    const epsilon = parseInt(epsilonBin, 2);

    return gamma * epsilon;
}

function getOxygenRate(data, bitOccurences, depth = 0) {
    if (data.length === 1) return data[0];

    const bitOccurenceToCheck = bitOccurences[depth];
    const bitToKeep = bitOccurenceToCheck[0] > bitOccurenceToCheck[1] ? 0 : 1;

    const filteredData = data.filter((entry) => entry[depth] === bitToKeep);
    return getOxygenRate(filteredData, getBitOccurences(filteredData), depth + 1);
}

function getScrubRate(data, bitOccurences, depth = 0) {
    if (data.length === 1) return data[0];

    const bitOccurenceToCheck = bitOccurences[depth];
    const bitToKeep = bitOccurenceToCheck[0] <= bitOccurenceToCheck[1] ? 0 : 1;

    const filteredData = data.filter((entry) => entry[depth] === bitToKeep);
    return getScrubRate(filteredData, getBitOccurences(filteredData), depth + 1);
}

function getPartTwo(data, bitOccurences) {
    const oxygenRateBinArr = getOxygenRate(data, bitOccurences);
    const scrubRateBinArr = getScrubRate(data, bitOccurences);

    const oxygenRate = parseInt(oxygenRateBinArr.join(''), 2);
    const scrubRate = parseInt(scrubRateBinArr.join(''), 2);

    return oxygenRate * scrubRate;
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);
    const bitOccurences = getBitOccurences(data);

    const partOne = getPartOne(bitOccurences);
    console.log('[DEBUG]: partOne ::: ', partOne);

    const partTwo = getPartTwo(data, bitOccurences);
    console.log('[DEBUG]: partTwo ::: ', partTwo);
});
