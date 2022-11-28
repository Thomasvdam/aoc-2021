const { getInput } = require('../setup');

function processLine(line) {
    const [, startingPos] = line.split(': ');
    // Zero index board position
    return Number(startingPos) - 1;
}

const BOARD_SIZE = 10;

class DeterministicDie {
    constructor() {
        this.rolls = 0;
        this.currentValue = 1;
    }

    roll() {
        this.rolls++;
        const { currentValue } = this;

        const newValue = currentValue + 1;
        this.currentValue = newValue > 100 ? 1 : newValue;

        return currentValue;
    }
}

function partOne(startPos1, startPos2) {
    const SCORE_GOAL = 1000;

    const die1 = new DeterministicDie();

    const players = [
        { score: 0, position: startPos1 },
        { score: 0, position: startPos2 },
    ];

    let currentPlayer = 0;
    while (players.every(({ score }) => score < SCORE_GOAL)) {
        const roll = die1.roll() + die1.roll() + die1.roll();

        const { position } = players[currentPlayer];
        const newPosition = (position + roll) % BOARD_SIZE;

        players[currentPlayer].position = newPosition;
        // Account for zero indexing the board
        players[currentPlayer].score += newPosition + 1;

        currentPlayer = (currentPlayer + 1) % players.length;
    }

    const losingPlayer = players.reduce((loser, player) => {
        if (player.score < loser.score) {
            return player;
        }
        return loser;
    });

    return losingPlayer.score * die1.rolls;
}

const POSSIBLE_THROWS = [3, 4, 5, 6, 7, 8, 9];
const THROW_WEIGHTS = {
    3: 1,
    4: 3,
    5: 6,
    6: 7,
    7: 6,
    8: 3,
    9: 1,
};

function playGame(currentPlayer, players) {
    const player = players[currentPlayer];
    const { position } = player;
    return POSSIBLE_THROWS.reduce((state, throwValue) => {
        const quantumPlayer = { ...player };
        const newPosition = (position + throwValue) % BOARD_SIZE;
        // Account for zero indexing the board
        quantumPlayer.score += newPosition + 1;
        quantumPlayer.position = newPosition;

        if (quantumPlayer.score >= 21) {
            state[currentPlayer] += THROW_WEIGHTS[throwValue];
        } else {
            nextPlayer = (currentPlayer + 1) % players.length;
            const outcomes = playGame(nextPlayer, players.map((innerPlayer) => {
                if (innerPlayer === player) {
                    return { ...quantumPlayer };
                }
                return { ...innerPlayer }
            }));
            outcomes.forEach((outcome, index) => {
                state[index] += THROW_WEIGHTS[throwValue] * outcome;
            });
        }

        return state;
    }, (new Array(players.length)).fill(0));
}

function partTwo(startPos1, startPos2) {
    const players = [
        { score: 0, position: startPos1 },
        { score: 0, position: startPos2 },
    ];
    const [playerOneWins, playerTwoWins] = playGame(0, players);

    return playerOneWins > playerTwoWins ? playerOneWins : playerTwoWins;
}

getInput(rawData => {
    const [startPos1, startPos2] = rawData.split('\n').map(processLine);

    const answerOne = partOne(startPos1, startPos2);
    console.log('Answer One:', answerOne);

    const answerTwo = partTwo(startPos1, startPos2);
    console.log('Answer Two:', answerTwo);
});
