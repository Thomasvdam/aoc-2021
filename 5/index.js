const { getInput } = require('../setup');

function processLine(line) {
    return line.split(' -> ').map((coords) => coords.split(',').map(Number));
}

function getFromTo(a, b) {
    if (a <= b) return [a, b];
    return [b, a];
}

function getHighDensityAreas(map) {
    let highDensityAreas = 0;
    for (const density of map.values()) {
        if (density >= 2) {
            highDensityAreas += 1;
        }
    }

    return highDensityAreas;
}

function drawMapCardinals(ranges) {
    const cardinalRanges = ranges.filter(([a, b]) => {
        return a[0] === b[0] || a[1] === b[1];
    });

    const map = new Map();

    for (const range of cardinalRanges) {
        const [start, end] = range;
        const [fromX, toX] = getFromTo(start[0], end[0]);
        for (let x = fromX; x <= toX; x++) {
            const [fromY, toY] = getFromTo(start[1], end[1]);
            for (let y = fromY; y <= toY; y++) {
                if (map.has(`${x}-${y}`)) {
                    map.set(`${x}-${y}`, map.get(`${x}-${y}`) + 1);
                } else {
                    map.set(`${x}-${y}`, 1);
                }
            }
        }
    }

    return map;
}

function drawMap(map, size) {
    for (let y = 0; y <= size; y++) {
        for (let x = 0; x <= size; x++) {
            if (map.has(`${x}-${y}`)) {
                process.stdout.write(`${map.get(`${x}-${y}`)}`);
            } else {
                process.stdout.write('.');
            }
        }
        process.stdout.write('\n');
    }
}

function partOne(ranges) {
    const map = drawMapCardinals(ranges);

    return getHighDensityAreas(map);
}

function addOrdinalsToMap(map, ranges) {
    const ordinalRanges = ranges.filter(([a, b]) => {
        return a[0] !== b[0] && a[1] !== b[1];
    });

    for (const range of ordinalRanges) {
        const [start, end] = range;
        const fromX = start[0];
        const toX = end[0];
        const fromY = start[1]
        const toY = end[1];
        const length = Math.abs(toX - fromX);

        const deltaX = fromX < toX ? 1 : -1;
        const deltaY = fromY < toY ? 1 : -1;

        for (let inc = 0; inc <= length; inc++) {
            const x = fromX + inc * deltaX;
            const y = fromY + inc * deltaY;
            if (map.has(`${x}-${y}`)) {
                map.set(`${x}-${y}`, map.get(`${x}-${y}`) + 1);
            } else {
                map.set(`${x}-${y}`, 1);
            }
        }
    }

    return map;
}

function partTwo(ranges) {
    const cardinalsMap = drawMapCardinals(ranges);
    const fullMap = addOrdinalsToMap(cardinalsMap, ranges);

    // const size = Math.max(...ranges.map(range => [...range[0], ...range[1]]).reduce((acc, curr) => curr.concat(acc)));
    // drawMap(fullMap, size);

    return getHighDensityAreas(fullMap);
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data);
    console.log(`Answer one: ${answerOne}`);

    const answerTwo = partTwo(data);
    console.log(`Answer two: ${answerTwo}`);

    // 19057 too low
    //
});
