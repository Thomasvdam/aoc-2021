const { getInput } = require('../setup');

function processLine(line) {
    const [instruction, coordsRaw] = line.split(' ');
    const coords = coordsRaw.split(',').map((range) => {
        const [axis, rangeRaw] = range.split('=');
        return rangeRaw.split('..').map(Number);
    });

    return coords.reduce((acc, coordRange) => {
        acc.box.push(coordRange);
        return acc;
    },
        { on: instruction === 'on', box: [] });
}

function partOne(instructions) {
    const reactor = new Set();
    instructions.forEach((instruction) => {
        const { on, box } = instruction;
        for (let i = box[0][0]; i <= box[0][1]; i++) {
            if (Math.abs(i) > 50) {
                continue;
            }
            for (let j = box[1][0]; j <= box[1][1]; j++) {
                if (Math.abs(j) > 50) {
                    continue;
                }
                for (let k = box[2][0]; k <= box[2][1]; k++) {
                    if (Math.abs(k) > 50) {
                        continue;
                    }
                    if (on) {
                        reactor.add(`${i},${j},${k}`);
                    } else {
                        reactor.delete(`${i},${j},${k}`);
                    }
                }
            }
        }
    });

    return reactor.size;
}


// Stolen from way smarter people than me
function getVolume(box) {
    const [x, y, z] = box;
    return (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1);
}

function intersection(boxA, boxB) {
    return boxA.map((axis, i) => [Math.max(axis[0], boxB[i][0]), Math.min(axis[1], boxB[i][1])]);
}

function intersectionVolume(newBox, boxes) {
    return boxes
        .map((box, i) => [intersection(box, newBox), i])
        .filter(([box]) => box.every(([min, max]) => max >= min))
        .map(([box, i]) => getVolume(box) - intersectionVolume(box, boxes.slice(i + 1)))
        .reduce((acc, volume) => acc + volume, 0);
}

function partTwo(instructions) {
    return instructions.reduceRight(
        ([totalVolume, previousBoxes], { on, box }) => {
            const newVolume = on ? getVolume(box) - intersectionVolume(box, previousBoxes) : 0;
            return [
                totalVolume + newVolume,
                [...previousBoxes, box],
            ];
        },
        [0, []]
    )[0];
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data);
    console.log(`Answer one: ${answerOne}`);

    const answerTwo = partTwo(data);
    console.log(`Answer two: ${answerTwo}`);
});
