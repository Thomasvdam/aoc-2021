const { getInput } = require('../setup');

function processNumbers(line) {
    return line.split (',').map(Number);
}

function processBoards(boards) {
    return boards.map((board) => {
        const contains = new Set();
        const layout = board.split('\n').map((boardLine) => {
            return boardLine.split(' ').filter(Boolean).map((boardNumber) => {
                const number = Number(boardNumber)
                contains.add(number);
                return number;
            });
        });

        return {
            contains,
            layout,
        }
    });
}

function findInBoard(board, number) {
    for (let y = 0; y < board.layout.length; y++) {
        const row = board.layout[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] === number) {
                return { y, x };
            }
        }
    }
}

function isBoardComplete(board, calledNumbers, latestNumber) {
    const { x, y } = findInBoard(board, latestNumber);

    const row = board.layout[y];
    const calledInRow = row.filter((number) => calledNumbers.has(number));
    if (calledInRow.length === row.length) {
        return true;
    }

    const column = board.layout.map((row) => row[x]);
    const calledInColumn = column.filter((number) => calledNumbers.has(number));
    return calledInColumn.length === column.length;
}

function getBoardScore(board, calledNumbers, latestNumber) {
    const uncalledNumbers = new Set([...board.contains].filter((number) => !calledNumbers.has(number)));
    const sumOfUncalledNumbers = [...uncalledNumbers].reduce((sum, number) => sum + number);
    return latestNumber * sumOfUncalledNumbers;
}

function partOne(numbers, boards) {
    const calledNumbers = new Set();

    for (const calledNumber of numbers) {
        calledNumbers.add(calledNumber);
        for (const board of boards) {
            if (!board.contains.has(calledNumber)) {
                continue;
            }

            if (isBoardComplete(board, calledNumbers, calledNumber)) {
                return getBoardScore(board, calledNumbers, calledNumber);
            }
        }
    }
}

function partTwo(numbers, boards) {
    const calledNumbers = new Set();
    const incompleteBoards = new Set(boards);

    for (const calledNumber of numbers) {
        calledNumbers.add(calledNumber);
        for (const board of incompleteBoards) {
            if (!board.contains.has(calledNumber)) {
                continue;
            }

            if (isBoardComplete(board, calledNumbers, calledNumber)) {
                if (incompleteBoards.size === 1) {
                    return getBoardScore(board, calledNumbers, calledNumber);
                }
                incompleteBoards.delete(board);
            }
        }
    }
}

getInput(rawData => {
    const [numbersRaw, ...boardsRaw] = rawData.split('\n\n');
    const numbers = processNumbers(numbersRaw);
    const boards = processBoards(boardsRaw);

    const answerOne = partOne(numbers, boards);
    console.log('[DEBUG]: answerOne ::: ', answerOne);

    const answerTwo = partTwo(numbers, boards);
    console.log('[DEBUG]: answerTwo ::: ', answerTwo);
});
