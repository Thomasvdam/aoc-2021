const { getInput } = require('../setup');

const OPENING = ['(', '[', '{', '<'];
const CLOSING = [')', ']', '}', '>'];
const BRACKET_PAIRS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};
const ERROR_SCORE_TABLE = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}
const AUTOCOMPLETE_SCORE_TABLE = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};

function processLine(line) {
    return line.split('');
}

function checkLine(line) {
    const stack = [];
    for (const char of line) {
        if (OPENING.includes(char)) {
            stack.push(char);
        } else if (CLOSING.includes(char)) {
            const opening = stack.pop();
            const expected = BRACKET_PAIRS[opening];
            if (char !== expected) {
                return {
                    corrupted: true,
                    illegalChar: char,
                };
            }
        }
    }
    return {
        corrupted: false,
        stack,
    };
}

function partOne(input) {
    const illegalLines = input.map(checkLine).filter(x => x.corrupted);
    return illegalLines.reduce((acc, curr) => acc + ERROR_SCORE_TABLE[curr.illegalChar], 0);
}

function autoComplete(line) {
    const { stack } = line;

    return stack.reduceRight((acc, curr) => {
        return acc.concat(BRACKET_PAIRS[curr]);
    }, []);
}

function scoreAutoComplete(autoComplete) {
    return autoComplete.reduce((acc, curr) => {
        const newScore = acc * 5;
        return newScore + AUTOCOMPLETE_SCORE_TABLE[curr];
    }, 0);
}

function partTwo(input) {
    const incompleteLines = input.map(checkLine).filter(x => !x.corrupted);
    const autoCompletes = incompleteLines.map(autoComplete);
    const scores = autoCompletes.map(scoreAutoComplete);
    scores.sort((a, b) => b - a);
    const middleIndex = (scores.length -1) / 2;

    return scores[middleIndex];
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data);
    console.log(`Part One: ${answerOne}`);

    const answerTwo = partTwo(data);
    console.log(`Part Two: ${answerTwo}`);
});
