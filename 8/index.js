const { getInput } = require('../setup');

function processLine(line) {
    const [inputRaw, outputRaw] =  line.split(' | ');
    return {
        input: inputRaw.split(' ').map(string => string.split('').sort().join('')),
        output: outputRaw.split(' ').map(string => string.split('').sort().join('')),
    };
}

function partOne(data) {
    const outputs = data.map((display) => display.output).reduce((acc, curr) => acc.concat(curr));
    const easyOutputs = outputs.filter((output) => {
        return output.length === 2 || output.length === 3 || output.length === 4 || output.length === 7;
    });

    return easyOutputs.length;
}

function getInitialMap(inputs) {
    const map = {};
    for (const input of inputs) {
        switch (input.length) {
        case 2:
            map[1] = input;
            break;
        case 3:
            map[7] = input;
            break;
        case 4:
            map[4] = input;
            break;
        case 7:
            map[8] = input;
            break;
        default:
            break;
        }
    }
    return map;
}

function containsCharacters(segment, characters) {
    for (const character of characters) {
        if (segment.indexOf(character) === -1) {
            return false;
        }
    }

    return true;
}

function mapDisplay(inputs) {
    const map = getInitialMap(inputs);
    const fiveSegments = inputs.filter((input) => input.length === 5);
    const sixSegments = inputs.filter((input) => input.length === 6);

    map[9] = sixSegments.find((input) => containsCharacters(input, map[4]));
    const remainingSixSegments = sixSegments.filter((input) => input !== map[9]);
    map[0] = remainingSixSegments.find((input) => containsCharacters(input, map[1]));
    map[6] = remainingSixSegments.filter((input) => input !== map[0])[0];

    map[3] = fiveSegments.find((input) => containsCharacters(input, map[1]));
    const remainingFiveSegments = fiveSegments.filter((input) => input !== map[3]);
    const diffEightSix = map[8].split('').find((character) => map[6].indexOf(character) === -1);
    map[2] = remainingFiveSegments.find((input) => input.includes(diffEightSix));
    map[5] = remainingFiveSegments.filter((input) => input !== map[2])[0];

    const reversedMap = {};
    for (const key in map) {
        reversedMap[map[key]] = key;
    }

    return reversedMap;
}

function convertDigit(digit, map) {
    return map[digit];
}

function partTwo(data) {
    return data.reduce((acc, display) => {
        const displayMap = mapDisplay(display.input);
        const convertedOutput = display.output.map((digit) => {
            return convertDigit(digit, displayMap)
        });

        const outputNumber = Number(convertedOutput.join(''));
        return acc + outputNumber;
    }, 0)
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data);
    console.log(`Answer One: ${answerOne}`);

    const answerTwo = partTwo(data);
    console.log(`Answer Two: ${answerTwo}`);
});
