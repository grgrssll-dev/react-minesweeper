const LEVEL_LABEL = 'DEFAULT_LEVEL';

const isMine = (cell) => (cell.number === -1);

const isEmpty = (cell) => (cell.number === 0);

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

const getNonMineNeighbors = (level, cell, gameData) => {
	return (getNeighbors(level, cell, gameData)
		.filter((c) => (!isMine(c) && !c.isRevealed && !c.isFlagged)));
};

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

const saveLevel = (level) => {
	if (window.localStorage) {
		window.localStorage.setItem(LEVEL_LABEL, JSON.stringify(level));
	}
};

const random = (max) => {
	return Math.round(Math.random() * max);
};

const Utils = {
	getSavedLevel,
	saveLevel,
	random,
	generateGameData,
	isMine,
	isEmpty,
	getNeighbors,
	getNonMineNeighbors,
};

export default Utils;
