const { getInput } = require('../setup');

class BinaryNode {
    constructor(parent = null) {
        this.parent = parent;
        this.left = null;
        this.right = null;
    }
}

function processLine(line) {
    const start = new BinaryNode();
    let currentNode = start;
    let parsingRight = false;
    line.split('').forEach((char, index) => {
        if (index === 0 || index === line.length - 1) return;

        if (char === '[') {
            const newNode = new BinaryNode(currentNode);
            if (parsingRight) {
                currentNode.right = newNode;
            } else {
                currentNode.left = newNode;
            }

            currentNode = newNode;
            parsingRight = false;
        } else if (char === ',') {
            parsingRight = true;
        } else if (char === ']') {
            currentNode = currentNode.parent;
        } else {
            if (parsingRight) {
                currentNode.right = Number(char);
            } else {
                currentNode.left = Number(char);
            }
        }
    });

    return start;
}

function splitNumber(number) {
    const left = Math.floor(number / 2);
    const right = number - left;
    return [left, right];
}

function splitNodeDirection(node, direction) {
    const [left, right] = splitNumber(node[direction]);
    const newNode = new BinaryNode(node);
    newNode.left = left;
    newNode.right = right;
    node[direction] = newNode;
}

function performSplit(node) {
    if (Number.isFinite(node)) { return false; }

    if (Number.isFinite(node.left) && node.left > 9) {
        splitNodeDirection(node, 'left')
        return true;
    }

    const splitLeft = performSplit(node.left);
    if (splitLeft) return true;
    
    if (Number.isFinite(node.right) && node.right > 9) {
        splitNodeDirection(node, 'right');
        return true;
    }

    return performSplit(node.right);
}

function addToLeft(node, number, visited, wentLeft = false) {
    if (node === null|| Number.isFinite(node)) { return false; }

    if (wentLeft && Number.isFinite(node.right)) {
        node.right += number;
        return true;
    } else if (!wentLeft && Number.isFinite(node.left)) {
        node.left += number;
        return true;
    }

    visited.add(node);

    if (wentLeft) {
        return addToLeft(node.right, number, visited, true);
    }

    return (!visited.has(node.left) && addToLeft(node.left, number, visited, true)) || addToLeft(node.parent, number, visited);
}

function addToRight(node, number, visited, wentRight = false) {
    if (node === null || Number.isFinite(node)) { return false; }

    if (wentRight && Number.isFinite(node.left)) {
        node.left += number;
        return true;
    } else if (!wentRight && Number.isFinite(node.right)) {
        node.right += number;
        return true;
    }

    visited.add(node);

    if (wentRight) {
        return addToRight(node.left, number, visited, true)
    }

    return (!visited.has(node.right) && addToRight(node.right, number, visited, true)) || addToRight(node.parent, number, visited);
}

function performExplosions(node, depth = 0) {
    if (Number.isFinite(node)) { return false; }

    if (depth >= 4 && Number.isFinite(node.left) && Number.isFinite(node.right)) {
        addToLeft(node.parent, node.left, new Set([node]));
        addToRight(node.parent, node.right, new Set([node]));

        if (node.parent.left === node) {
            node.parent.left = 0;
        } else {
            node.parent.right = 0;
        }

        return true;
    }

    const newDepth = depth + 1;
    return performExplosions(node.left, newDepth) || performExplosions(node.right, newDepth);
}

function reduceTree(node) {
    while (true) {
        // const stringified = printTree(node);
        // console.log('[Before step]: ', stringified);
        const performedExplosion = performExplosions(node);
        if (performedExplosion) { continue; }
        const performedSplit = performSplit(node);
        if (performedSplit) { continue; }
        break;
    }

    return node;
}

function printTree(node) {
    if (Number.isFinite(node)) {
        return node.toString();
    }

    return `[${printTree(node.left)},${printTree(node.right)}]`;
}

function calculateMagnitude(node) {
    if (Number.isFinite(node)) {
        return node;
    }

    return 3 * calculateMagnitude(node.left) + 2 * calculateMagnitude(node.right);
}

function partOne(data) {
    const solution = data.reduce((acc, node) => {
        const newNode = new BinaryNode();

        newNode.left = acc;
        acc.parent = newNode;

        newNode.right = node;
        node.parent = newNode;

        reduceTree(newNode);
        // const stringified = printTree(newNode);
        // console.log('[After addition]: ', stringified);
        return newNode;
    });

    const string = printTree(solution);
    console.log('[Solution]: ', string);
    return calculateMagnitude(solution);
}

function partTwo(rawData) {
    const rawSnailNumbers = rawData.split('\n');

    const magnitudes = [];

    for (const rawSnailNumberA of rawSnailNumbers) {
        for (const rawSnailNumberB of rawSnailNumbers) {
            if (rawSnailNumberA === rawSnailNumberB) continue;
            const startNode = new BinaryNode();

            startNode.left = processLine(rawSnailNumberA);
            startNode.left.parent = startNode;

            startNode.right = processLine(rawSnailNumberB);
            startNode.right.parent = startNode;;

            reduceTree(startNode);

            const magnitude = calculateMagnitude(startNode);
            magnitudes.push(magnitude);
        }
    }

    return Math.max(...magnitudes);
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);

    const answerOne = partOne(data);
    console.log('[DEBUG]: answerOne ::: ', answerOne);

    const answerTwo = partTwo(rawData);
    console.log('[DEBUG]: answerTwo ::: ', answerTwo);
});
