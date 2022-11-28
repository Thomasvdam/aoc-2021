const { getInput } = require('../setup');

function processLine(line) {
    return line.split('').map(Number);
}

function getCardinalNeighbours(data, x, y) {
    const neighbours = [];

    if (y > 0) {
        neighbours.push({ height: data[y - 1][x], x, y: y - 1 });
    }

    if (y < data.length - 1) {
        neighbours.push({ height: data[y + 1][x], x, y: y + 1 });
    }

    if (x > 0) {
        neighbours.push({ height: data[y][x - 1], x: x - 1, y });
    }

    if (x < data[y].length - 1) {
        neighbours.push({ height: data[y][x + 1], x: x + 1, y });
    }

    return neighbours;
}

function getLowPoints(input) {
    const lowPoints = [];

    for (let y = 0; y < input.length; y++) {
        const row = input[y];

        for (let x = 0; x < row.length; x++) {
            const height = row[x];
            const neighbours = getCardinalNeighbours(input, x, y);
            if (neighbours.every(neighbour => neighbour.height > height)) {
                lowPoints.push({ x, y, height });
            }
        }
    }

    return lowPoints;
}

function partOne(input) {
    const lowPoints = getLowPoints(input);
    return lowPoints.reduce((acc, point) => acc + 1 + point.height, 0);
}

function getBasin(input, lowPoint) {
    const basin = new Map();
    const toCheck = new Set([lowPoint]);
    while (toCheck.size > 0) {
        for (const [point] of toCheck.entries()) {
            if (point.height === 9) {
                toCheck.delete(point);
                continue;
            }
            const coords = `${point.x},${point.y}`;
            if (basin.has(coords)) {
                toCheck.delete(point);
                continue;
            }
            basin.set(coords, point);
            const neighbours = getCardinalNeighbours(input, point.x, point.y);
            neighbours.forEach((neighbour) => {
                toCheck.add(neighbour);
            });
        }
    }

    return [...basin];
}

function partTwo(input) {
    const lowPoints = getLowPoints(input);
    const basins = lowPoints.map((lowPoint) => getBasin(input, lowPoint));
    const basinSizes = basins.map((basin) => basin.length);
    basinSizes.sort((a, b) => b - a);
    const [a, b, c] = basinSizes;
    return a * b * c;
}

getInput(rawData => {
    const heightMap = rawData.split('\n').map(processLine);

    const answerOne = partOne(heightMap);
    console.log('Part One:', answerOne);

    const answerTwo = partTwo(heightMap);
    console.log('Part Two:', answerTwo);
});
