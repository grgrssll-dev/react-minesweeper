const LEVEL_LABEL = 'DEFAULT_LEVEL';

/**
 * Determines if a cell is a mine
 * @param cell
 */
const isMine = (cell) => (cell.number === -1);

/**
 * Determines if a cell is non adjacent to mines
 * @param cell
 */
const isEmpty = (cell) => (cell.number === 0);

/**
 * Gets surrounding cells where available
 * @param level
 * @param cell
 * @param gameData
 */
const getNeighbors = (level, cell, gameData) => {
	const neighbors = [];
	const hasTop = cell.y > 0;
	const hasBottom = cell.y < (level.rows - 1);
	const hasLeft = cell.x > 0;
	const hasRight = cell.x < (level.cols - 1);
	if (hasTop) {
		const yTop = cell.y - 1;
		neighbors.push(gameData[yTop][cell.x]);
		if (hasLeft) {
			neighbors.push(gameData[yTop][cell.x - 1]);
		}
		if (hasRight) {
			neighbors.push(gameData[yTop][cell.x + 1]);
		}
	}
	if (hasLeft) {
		neighbors.push(gameData[cell.y][cell.x - 1]);
	}
	if (hasRight) {
		neighbors.push(gameData[cell.y][cell.x + 1]);
	}
	if (hasBottom) {
		const yBottom = cell.y + 1;
		neighbors.push(gameData[yBottom][cell.x]);
		if (hasLeft) {
			neighbors.push(gameData[yBottom][cell.x - 1]);
		}
		if (hasRight) {
			neighbors.push(gameData[yBottom][cell.x + 1]);
		}
	}
	return neighbors;
};

/**
 * Gets surrounding cells that are not mines where available
 * @param level
 * @param cell
 * @param gameData
 */
const getNonMineNeighbors = (level, cell, gameData) => {
	return (getNeighbors(level, cell, gameData)
		.filter((c) => (!isMine(c) && !c.isRevealed && !c.isFlagged)));
};

/**
 * Gets surrounding cells that are not revealed or flagged where available
 * @param level
 * @param cell
 * @param gameData
 */
const getClearableNeighbors = (level, cell, gameData) => {
	return (getNeighbors(level, cell, gameData)
		.filter((c) => (!c.isRevealed && !c.isFlagged)));
};

/**
 * Creates cells for game based on level's board size
 */
const generateGameData = (level) => {
	const cellData = [];
	for (let y = 0; y < level.rows; y++) {
		const row = [];
		for (let x = 0; x < level.cols; x++) {
			row.push({
				x,
				y,
				isRevealed: false,
				isFlagged: false,
				number: 0,
				triggered: false,
			});
		}
		cellData.push(row);
	}
	return cellData;
};

/**
 * Gets locally saved level
 */
const getSavedLevel = () => {
	let savedLevel = null;
	if (window.localStorage) {
		try {
			savedLevel = JSON.parse(window.localStorage.getItem(LEVEL_LABEL));
		} catch (err) {
			savedLevel = null;
		}
	}
	return savedLevel;
};

/**
 * Saves level locally
 * @param level
 */
const saveLevel = (level) => {
	if (window.localStorage) {
		window.localStorage.setItem(LEVEL_LABEL, JSON.stringify(level));
	}
};

/**
 * Generates a random number between zero and $max
 * @param max
 */
const random = (max) => {
	return Math.round(Math.random() * max);
};

/**
 * Sets mines in game data where not startX/Y
 * @param level
 * @param startX
 * @param startY
 * @param gameData
 */
const setMines = (level, startX, startY, gameData) => {
	const { cols, rows } = level;
	let { mines } = level;
	while (mines > 0) {
		const randX = random(cols - 1);
		const randY = random(rows - 1);
		if (randX !== startX && randY !== startY && gameData[randY][randX].number > -1) {
			/* eslint-disable no-param-reassign */
			gameData[randY][randX].number = -1;
			mines--;
			/* eslint-enable no-param-reassign */
		}
	}
};

/**
 * Sets number of adjacent mines in data
 * @param level
 * @param gameData
 */
const setValues = (level, gameData) => {
	for (let y = 0; y < gameData.length; y++) {
		for (let x = 0; x < gameData[y].length; x++) {
			if (gameData[y][x].number > -1) {
				/* eslint-disable no-param-reassign */
				gameData[y][x].number = getNeighbors(level, gameData[y][x], gameData)
					.reduce((acc, n) => (acc + (isMine(n) ? 1 : 0)), 0);
				/* eslint-enable no-param-reassign */
			}
		}
	}
};

/**
 * Opens up non mine areas
 * @param level
 * @param cell
 * @param gameData
 */
const spreadClick = (level, cell, gameData) => {
	getNonMineNeighbors(level, cell, gameData).forEach((c) => {
		/* eslint-disable no-param-reassign */
		gameData[c.y][c.x].isRevealed = true;
		if (isEmpty(c)) {
			spreadClick(level, c, gameData);
		}
		/* eslint-enable no-param-reassign */
	});
};

/**
 * Clears non mine areas
 * @param level
 * @param cell
 * @param gameData
 * @param onMine
 */
const spreadClear = (level, cell, gameData, onMine, ) => {
	console.log('spread', cell.x, cell.y);
	getClearableNeighbors(level, cell, gameData).forEach((c) => {
		console.log('neightbor', c.x, c.y, c.number);
		/* eslint-disable no-param-reassign */
		gameData[c.y][c.x].isRevealed = true;
		if (isMine(c)) {
			onMine(cell.x, cell.y);
		} else if (isEmpty(c)) {
			spreadClear(level, c, gameData, onMine);
		}
		/* eslint-enable no-param-reassign */
	});
};


const publish = (type, data = {}) => {
	if (window.dispatchEvent) {
		window.dispatchEvent(new CustomEvent(type, data));
	} else {
		throw new Error('Missing window.dispatch');
	}
};

const subscribe = (type, handler) => {
	window.addEventListener(type, handler);
};

const unsubscribe = (type, handler) => {
	window.removeEventListener(type, handler);
};

const Utils = {
	setMines,
	setValues,
	spreadClick,
	spreadClear,
	getSavedLevel,
	saveLevel,
	random,
	generateGameData,
	isMine,
	isEmpty,
	getNeighbors,
	getNonMineNeighbors,
	getClearableNeighbors,
	publish,
	subscribe,
	unsubscribe,
};

export default Utils;
