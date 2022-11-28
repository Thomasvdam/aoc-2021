const { getInput } = require('../setup');

function processLine(line) {
    const [instruction, a, b] = line.split(' ');
    const isNumber = !Number.isNaN(Number(b));

    return {
        instruction,
        a,
        isNumber,
        b: isNumber ? Number(b) : b,
    };
}

// Cute but way too slow.
function runProgram(instructions, inputs) {
    const alu = {
        w: 0,
        x: 0,
        y: 0,
        z: 0,
    };
    const inputsRemaining = inputs.slice();

    for (const instruction of instructions) {
        const b = instruction.isNumber ? instruction.b : alu[instruction.b];

        switch (instruction.instruction) {
        case 'inp':
            if (inputsRemaining.length === 0) throw new Error('Insufficient inputs');

            alu[instruction.a] = inputsRemaining.shift();
            break;
        case 'add':
            alu[instruction.a] = alu[instruction.a] + b;
            break;
        case 'mul':
            alu[instruction.a] = alu[instruction.a] * b;
            break;
        case 'div':
            alu[instruction.a] = Math.floor(alu[instruction.a] / b);
            break;
        case 'mod':
            alu[instruction.a] = alu[instruction.a] % b;
            break;
        case 'eql':
            alu[instruction.a] = alu[instruction.a] === b ? 1 : 0;
            break;
        default:
            throw new Error('Unknown instruction: ' + instruction.instruction);
        }
    }

    return alu;
}

function partOne(program) {
    return runProgram(program, [1, 1]);
}

getInput(rawData => {
    const program = rawData.split('\n').map(processLine);
    
    const answerOne = partOne(program);
    console.log('Part One:', answerOne);
});
