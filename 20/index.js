const { getInput } = require('../setup');

function processLine(line) {
    return line.split('').map(char => char === '#');
}

function createEnhancePixel(enhancementAlgorithm) {
    return (number) => enhancementAlgorithm[number] === '#';
}

function getSurroundingPixels(image, x, y, flippedInfinite = false) {
    const surroundingPixels = [];
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            const adjecentX = x + xOffset;
            const adjecentY = y + yOffset;

            if (adjecentX < 0 || adjecentY < 0 || adjecentX >= image.length || adjecentY >= image.length) {
                surroundingPixels.push(flippedInfinite);
            } else {
                surroundingPixels.push(image[adjecentY][adjecentX]);
            }
        }
    }

    return surroundingPixels;
}

function convertToNumber(image, x, y, flippedInfinite = false) {
    const surroundingPixels = getSurroundingPixels(image, x, y, flippedInfinite);
    const binaryString = surroundingPixels.map(on => on ? 1 : 0).join('');

    return parseInt(binaryString, 2);
}

function enhanceImage(enhancePixel, image, flippedInfinite = false) {
    const enhanced = [];
    const enhancedSize = image.length + 2;

    for (let y = 0; y < enhancedSize; y++) {
        const row = [];
        for (let x = 0; x < enhancedSize; x++) {
            const originalX = x - 1;
            const originalY = y - 1;
            const numericValue = convertToNumber(image, originalX, originalY, flippedInfinite);
            const result = enhancePixel(numericValue);
            row.push(result);
        }
        enhanced.push(row);
    }

    return enhanced;
}

function countPixels(image) {
    return image.reduce((acc, row) => acc + row.reduce((acc, pixel) => acc + (pixel ? 1 : 0), 0), 0);
}

function partOne(enhancePixel, image) {
    const enhanced1 = enhanceImage(enhancePixel, image);
    const enhanced2 = enhanceImage(enhancePixel, enhanced1, true);

    return countPixels(enhanced2);
}

function partTwo(enhancePixel, image) {
    let current = image;
    for (let i = 0; i < 50; i++) {
        current = enhanceImage(enhancePixel, current, i % 2 === 1);
    }

    current.forEach(row => console.log(row.map(pixel => pixel ? '#' : '.').join('')));
    return countPixels(current);
}

getInput(rawData => {
    const [enhancementAlgorithm, input] = rawData.split('\n\n');
    const enhancePixel = createEnhancePixel(enhancementAlgorithm);
    const image = input.split('\n').map(processLine);

    const answerOne = partOne(enhancePixel, image);
    console.log(`Answer One: ${answerOne}`);

    const answerTwo = partTwo(enhancePixel, image);
    console.log(`Answer Two: ${answerTwo}`);
});
