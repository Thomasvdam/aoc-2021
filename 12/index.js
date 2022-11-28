const { getInput } = require('../setup');

function processLine(line) {
    return line.split('-').map((cave) => {
        const isBig = /^[A-Z]*$/.test(cave);
        return {
            cave,
            isBig,
        }
    });
}

function constructMap(data) {
    const map = new Map();
    data.forEach(([to, from]) => {
        if (!map.has(to.cave)) {
            map.set(to.cave, {
                cave: to.cave,
                destinations: [],
            });
        }
        map.get(to.cave).destinations.push(from);

        if (!map.has(from.cave)) {
            map.set(from.cave, {
                cave: from.cave,
                destinations: []
            });
        }
        map.get(from.cave).destinations.push(to);
    });

    return map;
}

function traverseMap(map, caveName, route, maxSmallRevists = 0) {
    if (caveName === 'end') {
        return route;
    }

    const { destinations } = map.get(caveName);
    if (!destinations) {
        return route;
    }

    const potentialDestinations = destinations.map((destination) => {
        if (destination.cave === 'start') { return null; }
        if (destination.isBig) { return destination; }
        const duplicateSmallCaves = route.reduce((acc, cave) => {
            if (cave.cave === destination.cave) return acc + 1;
            return acc;
        }, 0);

        if (duplicateSmallCaves > maxSmallRevists) {
            return null;
        }

        return {
            ...destination,
            revistsLeft: maxSmallRevists - duplicateSmallCaves,
        }
    });

    const viableDestinations = potentialDestinations.filter(Boolean);

    if (viableDestinations.length === 0) {
        return route;
    }

    return viableDestinations.map((destination) => {
        const newRoute = [...route, destination];
        const newMaxRevists = destination.revistsLeft ?? maxSmallRevists;
        return traverseMap(map, destination.cave, newRoute, newMaxRevists);
    });
}

function flattenRoutes(routes) {
    return routes.reduce((acc, route) => {
        if (Array.isArray(route[0])) {
            const nestedRoutes = flattenRoutes(route);
            return [...acc, ...nestedRoutes];
        }
        return [...acc, route];
    }, []);
}

function isValidRoute(route) {
    return route[route.length - 1].cave === 'end';
}

function partOne(map) {
    const routes = traverseMap(map, 'start', [{ cave: 'start', isBig: false }]);
    const flatRoutes = flattenRoutes(routes).filter(isValidRoute);

    return flatRoutes.length;
}

function partTwo(map) {
    const routes = traverseMap(map, 'start', [{ cave: 'start', isBig: false }], 1);
    const flatRoutes = flattenRoutes(routes).filter(isValidRoute);

    return flatRoutes.length;
}

getInput(rawData => {
    const data = rawData.split('\n').map(processLine);
    const map = constructMap(data);

    const answerOne = partOne(map);
    console.log('Part One:', answerOne);

    const answerTwo = partTwo(map);
    console.log('Part Two:', answerTwo);
});
