const { getInput } = require('../setup');

function processLine(line) {
    return line.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('').split('');
}

function parseLiteral(literal) {
    let endReached = false;
    let binaryString = '';
    while (!endReached) {
        const [header, ...body] = literal.splice(0, 5);
        if (header === '0') endReached = true;
        binaryString = [...binaryString, ...body];
    }

    return [parseInt(binaryString.join(''), 2), literal];
}

function parseByteLengthOperator(operator) {
    const length = parseInt(operator.splice(0, 15).join(''), 2);
    const subpackets = operator.splice(0, length);

    return [parsePackets(subpackets), operator];
}

function parsePacketNumberOperator(operator) {
    const numberOfPackets = parseInt(operator.splice(0, 11).join(''), 2);
    const packetsAndRest = parsePackets(operator, numberOfPackets);
    const packets = packetsAndRest.slice(0, numberOfPackets);
    const rest = packetsAndRest.slice(numberOfPackets);

    return [packets, rest];
}

function parseOperator(operator) {
    const [lengthType, ...body] = operator;

    if (lengthType === '0') return parseByteLengthOperator(body);

    return parsePacketNumberOperator(body);
}

function getParseMethod(type) {
    if (type === 4) return parseLiteral;

    return parseOperator;
}

function parsePackets(input, depth = Infinity) {
    if (depth === 0) return input;

    if (!input || input.length === 0 || /^0+$/.test(input.join(''))) return null;

    const [h1, h2, h3, t1, t2, t3, ...body] = input;
    const packetVersion = parseInt(`${h1}${h2}${h3}`, 2);
    const packetType = parseInt(`${t1}${t2}${t3}`, 2);

    const parseBody = getParseMethod(packetType);
    const [value, rest] = parseBody(body);

    const restPackets = parsePackets(rest, depth - 1);
    const packet = {
        version: packetVersion,
        type: packetType,
        body: value,
    };

    if (!restPackets) return packet;

    if (Array.isArray(restPackets)) {
        return [packet, ...restPackets];
    }

    return [packet, restPackets];
}

function getVersionSum(packet) {
    const version = packet.version;
    if (Array.isArray(packet.body)) {
        return version + packet.body.reduce((acc, innerPacket) => acc + getVersionSum(innerPacket), 0);
    }

    if (Number.isFinite(packet.body)) return version;
    
    return version + getVersionSum(packet.body);
}

function partOne(packets) {
    const versionSum = getVersionSum(packets);
    return versionSum;
}

function executePacket(packet) {
    switch (packet.type) {
    case 0:
        if (!Array.isArray(packet.body)) return executePacket(packet.body);
        return packet.body.reduce((acc, subPacket) => acc + executePacket(subPacket), 0);
    case 1:
        if (!Array.isArray(packet.body)) return executePacket(packet.body);
        return packet.body.reduce((acc, subPacket) => acc * executePacket(subPacket), 1);
    case 2:
        if (!Array.isArray(packet.body)) return executePacket(packet.body);
        return Math.min(...packet.body.map((subPacket) => executePacket(subPacket)));
    case 3:
        if (!Array.isArray(packet.body)) return executePacket(packet.body);
        return Math.max(...packet.body.map((subPacket) => executePacket(subPacket)));
    case 4:
        return packet.body;
    case 5:
        return executePacket(packet.body[0]) > executePacket(packet.body[1]) ? 1 : 0;
    case 6:
        return executePacket(packet.body[0]) < executePacket(packet.body[1]) ? 1 : 0;
    case 7:
        return executePacket(packet.body[0]) === executePacket(packet.body[1]) ? 1 : 0;
    default:
        throw new Error(`Unknown packet type ${packet.type}`);
    }
}

function partTwo(packets) {
    return executePacket(packets);
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);
    const packets = parsePackets(data[0]);

    const answerOne = partOne(packets);
    console.log('Part One:', answerOne);

    const answerTwo = partTwo(packets);
    console.log('Part Two:', answerTwo);
});
