const { getInput } = require('../setup');

function processDotsLine(line) {
    return line;
}

function processFoldsLine(line) {
    const [axis, positionRaw] = line.replace('fold along ', '').split('=');
    return {
        axis,
        position: Number(positionRaw),
    };
}

function foldDots(dots, axis, position) {
    const newDots = new Set();
    for (const dot of dots) {
        const [x, y] = dot.split(',');
        if (axis === 'x') {
            if (x > position) {
                const newX = position - (x - position)
                newDots.add(`${newX},${y}`);
            } else {
                newDots.add(`${x},${y}`);
            }
        } else {
            if (y > position) {
                const newY = position - (y - position)
                newDots.add(`${x},${newY}`);
            } else {
                newDots.add(`${x},${y}`);
            }
        }
    }

    return newDots;
}

function partOne(dots, folds) {
    const [firstFold] = folds;
    const newDots = foldDots(dots, firstFold.axis, firstFold.position);
    return newDots.size;
}

function printDots(dots) {
    let coords = [];
    for (const dot of dots) {
        coords.push(dot.split(',').map(Number));
    }

    const xCoords = coords.map(coord => coord[0]);
    const yCoords = coords.map(coord => coord[1]);

    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            const coord = `${x},${y}`;
            if (dots.has(coord)) {
                process.stdout.write('#');
            } else {
                process.stdout.write('.');
            }
        }
        process.stdout.write('\n');
    }
}

function partTwo(dots, folds) {
    let state = dots;
    for (const fold of folds) {
        state = foldDots(state, fold.axis, fold.position);
    }
    console.log('Answer two:\n');
    printDots(state);
}

getInput(rawData => {
    const [dotsRaw, foldsRaw] = rawData.split('\n\n');
    const dotsList = dotsRaw.split('\n').map(processDotsLine);
    const folds = foldsRaw.split('\n').map(processFoldsLine);
    const dots = dotsList.reduce((acc, coords) => {
        acc.add(coords);
        return acc;
    }, new Set());

    const answerOne = partOne(dots, folds);
    console.log(`Answer one: ${answerOne}`);

    partTwo(dots, folds);
});
