const { getInput } = require('../setup');

function processLine(line) {
    return line;
}

function getDeltas(readings) {
    let prev;
    return readings.reduce((acc, curr) => {
        if (prev === undefined) {
            // first iteration
        } else if (curr > prev) {
            acc.inc += 1;
        } else if (curr === prev) {
            acc.eq += 1;
        } else {
            acc.dec += 1;
        }
        prev = curr;

        return acc;
    }, { inc: 0, dec: 0, eq: 0 });
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine).map(Number);
    const deltasSimple = getDeltas(data);
    console.log('[DEBUG]: deltasSimple ::: ', deltasSimple);

    const windowedData = data.map((_, i) => {
        return data.slice(i, i + 3);
    }).filter(arr => arr.length === 3).map(arr => arr.reduce((acc, curr) => acc + curr));

    const deltasWindowed = getDeltas(windowedData);
    console.log('[DEBUG]: deltasWindowed ::: ', deltasWindowed);
});
