const { getInput } = require('../setup');

function processLine(line) {
    const [xRangeRaw, yRangeRaw] = line.replace('target area: ', '').split(', ');
    const xRange = xRangeRaw.replace('x=', '').split('..').map(Number);
    const yRange = yRangeRaw.replace('y=', '').split('..').map(Number);

    return [xRange, yRange];
}

function beforeTarget(position, xRange, yRange) {
    if (position.x < xRange[0]) {
        return true;
    }

    if (position.y > yRange[1]) {
        return true;
    }

    return false;
}

function checkPosition(position, xRange, yRange) {
    if (position.x > xRange[1]) {
        throw new Error('Overshot target area horizontally');
    }

    if (position.y < yRange[0]) {
        throw new Error('Overshot target area vertically');
    }
}

function executeDirectory(xVel, yVel, xRange, yRange) {
    const velocity = { x: xVel, y: yVel };
    const position = { x: 0, y: 0 };
    const path = [{ ...position }];

    while (beforeTarget(position, xRange, yRange)) {
        if (velocity.x === 0 && position.x < xRange[0]) {
            throw new Error('Insufficient horizontal velocity');
        }

        position.x += velocity.x;
        position.y += velocity.y;
        checkPosition(position, xRange, yRange);
        
        path.push({ ...position });
        velocity.x = velocity.x === 0 ? velocity.x : velocity.x - 1;
        velocity.y -= 1;        
    }


    return path;
}

function isValidXVelocity(xPos, xVelocity, xRange, depth = 1) {
    const newPos = xPos + xVelocity;
    const isInTarget = xRange[0] <= newPos && newPos <= xRange[1]

    if (isInTarget) return { valid: true, minSteps: depth };

    if (xVelocity === 0) return { valid: false };

    const newXVelocity = xVelocity - 1;
    return isValidXVelocity(newPos, newXVelocity, xRange, depth + 1);
}

function getMaxXSteps(xPos, xVelocity, xRange, depth = 1) {
    const newPos = xPos + xVelocity;
    const isOldInTarget = xRange[0] <= xPos && xPos <= xRange[1];
    const isNewInTarget = xRange[0] <= newPos && newPos <= xRange[1];

    if (isOldInTarget && !isNewInTarget) return depth - 1;
    const newXVelocity = xVelocity - 1;

    if (newXVelocity === 0 && isNewInTarget) return Infinity;
    return getMaxXSteps(newPos, newXVelocity, xRange, depth + 1);
}

function findMinXVelocity(xRange) {
    const maxXVelocity = xRange[1];
    let xVelocity = 0;
    while (true) {
        xVelocity += 1;
        if (xVelocity > maxXVelocity) {
            throw new Error('No valid x velocity found');
        }
        const { valid, minSteps } = isValidXVelocity(0, xVelocity, xRange);
        if (valid) {
            return { xVelocity, minSteps, maxSteps: getMaxXSteps(0, xVelocity, xRange) };
        }
    }
}

function findAllXVelocities(xRange) {
    const xVelocities = [];
    let xVelocity = 0;
    while (true) {
        xVelocity += 1;
        if (xVelocity > xRange[1]) {
            return xVelocities
        }
        const { valid, minSteps } = isValidXVelocity(0, xVelocity, xRange);
        if (valid) {
            xVelocities.push({ xVelocity, minSteps, maxSteps: getMaxXSteps(0, xVelocity, xRange) });
        }
    }
}

function isValidYVelocity(yPos, yVelocity, yRange, minSteps, maxSteps) {
    const newPos = yPos + yVelocity;
    const isInTarget = yRange[0] <= newPos && newPos <= yRange[1]
    const newYVelocity = yVelocity - 1;

    if (minSteps > 1) return isValidYVelocity(newPos, newYVelocity, yRange, minSteps - 1, maxSteps - 1);

    if (isInTarget) return true;

    if (newPos < yRange[0] || maxSteps <= 1) return false;

    return isValidYVelocity(newPos, newYVelocity, yRange, minSteps - 1, maxSteps - 1);
}

function findMaxYVelocity(yRange, minSteps, maxSteps) {
    let yVelocity = 0;
    let lastValid = 0;
    while (true) {
        if (yVelocity >= Math.abs(yRange[0])) return lastValid;

        const isValid = isValidYVelocity(0, yVelocity, yRange, minSteps, maxSteps);
        if (isValid) {
            lastValid = yVelocity;
        }

        yVelocity += 1;
    }
}

function findAllYVelocities(yRange, minSteps, maxSteps) {
    const yVelocities = [];
    let yVelocity = yRange[0];
    while (true) {
        if (yVelocity >= Math.abs(yRange[0])) return yVelocities;

        const isValid = isValidYVelocity(0, yVelocity, yRange, minSteps, maxSteps);
        if (isValid) {
            yVelocities.push(yVelocity);
        }

        yVelocity += 1;
    }
}

function partOne(targetArea) {
    const xVelocity = findMinXVelocity(targetArea[0]);
    const yVelocity = findMaxYVelocity(targetArea[1], xVelocity.minSteps, xVelocity.maxSteps);

    const path = executeDirectory(xVelocity.xVelocity, yVelocity, targetArea[0], targetArea[1]);
    return Math.max(...path.map((position) => position.y));
}

function partTwo(targetArea) {
    const xVelocities = findAllXVelocities(targetArea[0]);
    const allStartingVelocities = xVelocities.map((xVelocity) => {
        const allYforX = findAllYVelocities(targetArea[1], xVelocity.minSteps, xVelocity.maxSteps);
        return allYforX.map((yVelocity) => { return { xVelocity: xVelocity.xVelocity, yVelocity } });
    }).reduce((acc, val) => acc.concat(val), []);

    return allStartingVelocities.length;
}

getInput(rawData => {
    const targetArea = rawData.split('\n').map(processLine)[0];

    const answerOne = partOne(targetArea);
    console.log('Part One:', answerOne);

    const answerTwo = partTwo(targetArea);
    console.log('Part Two:', answerTwo);
});
