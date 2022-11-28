const { getInput } = require('../setup');

function processInsertionLine(line) {
    return line.split(' -> ');
}

function constructPolymer(template) {
    const parts = template.split('');
    const start = { next: null, value: parts[0] };
    let current = start;
    for (let i = 1; i < parts.length; i++) {
        const next = { next: null, value: parts[i] };
        current.next = next;
        current = next;
    }

    return start;
}

function getPairs(polymer) {
    const pairs = [];
    let current = polymer;
    while (current.next) {
        const { next } = current;

        pairs.push({
            key: `${current.value}${next.value}`,
            nodes: [current, next],
        });
        current = next;
    }
    return pairs;
}

function applyInsertions(polymer, insertionRules) {
    const pairs = getPairs(polymer);
    for (const pair of pairs) {
        if (insertionRules[pair.key]) {
            const [first, second] = pair.nodes;
            const newElement = {
                value: insertionRules[pair.key],
                next: second,
            }
            first.next = newElement;
        }
    }
}

function printPolymer(polymer) {
    let current = polymer;
    console.log('[DEBUG]: Polymer:');
    while (current) {
        process.stdout.write(current.value);
        current = current.next;
    }
    process.stdout.write('\n');
}

function countElements(polymer) {
    const elements = new Map();
    let current = polymer;
    while (current) {
        if (!elements.has(current.value)) {
            elements.set(current.value, 0);
        }
        elements.set(current.value, elements.get(current.value) + 1);
        current = current.next;
    }

    return elements;
}

function getScore(polymer) {
    const elementCounts = countElements(polymer);
    const sortedElements = [...elementCounts.entries()].sort((a, b) => b[1] - a[1]);
    return sortedElements[0][1] - sortedElements[sortedElements.length - 1][1];
}

function partOne(polymer, insertionRules) {
    for (let index = 0; index < 10; index++) {
        applyInsertions(polymer, insertionRules);
    }

    return getScore(polymer);
}

// As expected the naive way is too inefficient for part 2 :D

function applyInsertionsPaired(pairs, insertionRules) {
    const newPairs = {...pairs}
    for (const key of Object.keys(pairs)) {
        if (insertionRules[key] && pairs[key] >= 1) {
            newPairs[key] -= pairs[key];
            const [first, second] = key;
            const newPairOne = first + insertionRules[key];
            const newPairTwo = insertionRules[key] + second;

            if (!newPairs[newPairOne]){
                newPairs[newPairOne] = 0;
            }
            newPairs[newPairOne] += pairs[key];

            if (!newPairs[newPairTwo]){
                newPairs[newPairTwo] = 0;
            }
            newPairs[newPairTwo] += pairs[key];
        }
    }

    return newPairs;
}

function countPairedElements(pairs) {
    const elements = new Map();
    for (const key of Object.keys(pairs)) {
        const [element1, element2] = key;
        if (!elements.has(element1)) {
            elements.set(element1, 0);
        }

        elements.set(element1, elements.get(element1) + pairs[key]);

        if (!elements.has(element2)) {
            elements.set(element2, 0);
        }
        elements.set(element2, elements.get(element2) + pairs[key]);
    }

    return elements;
}

function partTwo(polymer, insertionRules) {
    let pairs = {};
    const initialPairs = getPairs(polymer);
    for (const pair of initialPairs) {
        if (!pairs[pair.key]) {
            pairs[pair.key] = 0
        }
        pairs[pair.key] += 1;
    }

    for (let index = 0; index < 40; index++) {
        pairs = applyInsertionsPaired(pairs, insertionRules);
    }

    const elementCounts = countPairedElements(pairs);
    // Account for missing double counts of the start and end elements
    const startElementValue = polymer.value;
    let endElement = polymer.next;
    while (endElement.next) {
        endElement = endElement.next;
    }
    const endElementValue = endElement.value;
    elementCounts.set(startElementValue, elementCounts.get(startElementValue) + 1);
    elementCounts.set(endElementValue, elementCounts.get(endElementValue) + 1);

    for (const [key, value] of elementCounts.entries()) {
        elementCounts.set(key, value / 2);
    }

    const sortedElements = [...elementCounts.entries()].sort((a, b) => b[1] - a[1]);
    return sortedElements[0][1] - sortedElements[sortedElements.length - 1][1];
}

getInput(rawData => {
    const [templateRaw, insertionsRaw] = rawData.split('\n\n');
    const insertionRules = insertionsRaw.split('\n').map(processInsertionLine).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

    const polymerOne = constructPolymer(templateRaw);
    const answerOne = partOne(polymerOne, insertionRules);
    console.log(`Part One: ${answerOne}`);

    const polymerTwo = constructPolymer(templateRaw);
    const answerTwo = partTwo(polymerTwo, insertionRules);
    console.log(`Part Two: ${answerTwo}`);
});
