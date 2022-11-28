const { getInput } = require('../setup');
const { EasyStar } = require('./easystar');

function processLine(line) {
    return line.split('').map(Number);
}

const TILE_TYPES = [1,2,3,4,5,6,7,8,9];

function lowestCost(data) {
    return new Promise((resolve, reject) => {
        const easystar = new EasyStar.js();
        easystar.setGrid(data);
        easystar.setAcceptableTiles(TILE_TYPES);
        TILE_TYPES.forEach(tileType => {
            easystar.setTileCost(tileType, tileType);
        })
        easystar.findPath(0, 0, data[0].length - 1, data.length - 1, (path) => {
            if (path === null) {
                reject(new Error('No path found'));
            } else {
                resolve(path);
            }
        });
        easystar.calculate();
    });
}

async function partOne(data) {
    const path = await lowestCost(data);
    return path.slice(1).reduce((acc, { x, y }) => acc + data[y][x], 0);
}

const FULL_SIZE = 5;
function getFullMap(data) {
    const fullmap = [];
    for (let vertical = 0; vertical < FULL_SIZE * data.length; vertical++) {
        fullmap.push([]);
        for (let horizontal = 0; horizontal < FULL_SIZE * data[0].length; horizontal++) {
            const originalRow = vertical % data.length;
            const originalColumn = horizontal % data[0].length;
            const originalValue = data[originalRow][originalColumn];

            const rowDelta = Math.floor(vertical / data.length);
            const columnDelta = Math.floor(horizontal / data[0].length);

            const value = originalValue + rowDelta + columnDelta;
            const newValue = value > 9 ? ((value % 9) || 9) : value;
            fullmap[vertical].push(newValue);
        }
    }

    return fullmap;
}

async function partTwo(data) {
    const fullMap = getFullMap(data);
    const path = await lowestCost(fullMap);
    return path.slice(1).reduce((acc, { x, y }) => acc + fullMap[y][x], 0);
}

getInput(async (rawData) => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = await partOne(data);
    console.log('Part One:', answerOne);

    const answerTwo = await partTwo(data);
    console.log('Part Two:', answerTwo);
});
