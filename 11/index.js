const { getInput } = require('../setup');

function processLine(line) {
    return line.split('').map(Number);
}

function getSurrounding(x, y, size = 10) {
    const surrounding = [];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i < 0 || j < 0 || i >= size || j >= size) {
                continue;
            }

            if (i === x && j === y) {
                continue;
            }

            surrounding.push([i, j]);
        }
    }

    return surrounding;
}

function performStep(octopi) {
    const flashing = new Set();
    const flashed = new Set();

    octopi.forEach((row, y) => {
        row.forEach((octopus, x) => {
            const newValue = octopus + 1
            if (newValue === 10) {
                flashing.add(`${x},${y}`);
            }

            octopi[y][x] = newValue;
        });
    });

    while (flashing.size > 0) {
        for (const flashingOctopus of flashing.values()) {
            const [x, y] = flashingOctopus.split(',').map(Number);
            const surrounding = getSurrounding(x, y);

            surrounding.forEach(([x, y]) => {
                octopi[y][x] = octopi[y][x] + 1
                if (octopi[y][x] === 10) {
                    flashing.add(`${x},${y}`);
                }
            });

            flashed.add(`${x},${y}`);
            flashing.delete(flashingOctopus);
        }
    }

    for (const flashedOctopus of flashed.values()) {
        const [x, y] = flashedOctopus.split(',').map(Number);
        octopi[y][x] = 0;
    }

    return flashed;
}

function printOcotpi(octopi) {
    octopi.forEach((row) => {
        console.log(row.map(String).join(''));
    });
    console.log('');
}

function partOne(octopi) {
    let count = 0;
    for (let i = 0; i < 100; i++) {
        const flashed = performStep(octopi);
        count += flashed.size;
    }

    return count;
}

function partTwo(octopi) {
    let flashed = new Set();
    let round = 0;
    while (flashed.size < 100) {
        flashed = performStep(octopi);
        round++;
    }

    return round;
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data.map(row => row.map(octopus => octopus)));
    console.log('[DEBUG]: answerOne ::: ', answerOne);

    const answerTwo = partTwo(data.map(row => row.map(octopus => octopus)));
    console.log('[DEBUG]: answerTwo ::: ', answerTwo);
});
