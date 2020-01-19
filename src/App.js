import React, { useState } from 'react';
import { FLAG, MINE } from './icons';
import './App.css';

import Menu from './components/menu/Menu';
import Heading from './components/heading/Heading';
import Board from './components/board/Board';

import Levels from './Levels';
import Utils from './Utils';

const defaultLevel = Levels.find((l) => l.name === 'Beginner');
const LEVEL_LABEL = 'DEFAULT_LEVEL';

let savedLevel = null;
try {
	savedLevel = JSON.parse(localStorage.getItem(LEVEL_LABEL));
} catch (err) {
	savedLevel = null;
}

const initialLevel = savedLevel || defaultLevel;
let timerInterval = null;
let startTime = null;

const generateGameData = (level) => {
	const cellData = [];
	for (let y = 0; y < level.rows; y++) {
		const row = [];
		for (let x = 0; x < level.cols; x++) {
			row.push({
				x: x,
				y: y,
				isRevealed: false,
				isFlagged: false,
				number: 0
			});
		}
		cellData.push(row);
	}
	return cellData;
};

function app() {
	const [level, setLevel] = useState(initialLevel);
	const [minesFlagged, setMinesFlagged] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [clicks, setClicks] = useState(0);
	const [isGameOver, setGameOver] = useState(false);
	const [data, setData] = useState(generateGameData(initialLevel));


	const onLevelChange = (newLevel) => {
		console.log('level change', newLevel);
		onNewGame();
		setLevel(newLevel);
		setData(generateGameData(newLevel));
		localStorage.setItem(LEVEL_LABEL, JSON.stringify(newLevel));
	};

	const onNewGame = () => {
		console.log('new game');
		endGame();
		resetGame();
	};

	const onGameStart = () => {
		onNewGame();
	};

	const onMineFlag = (x, y) => {
		if (!isGameOver) {
			console.log(FLAG, x, y);
			const cell = data[y][x];
			const wasFlagged = cell.isFlagged;
			if (!cell.isRevealed) {
				data[y][x].isFlagged = !wasFlagged;
				const minesFlaggedCount = minesFlagged + ((wasFlagged) ? -1 : 1);
				setMinesFlagged(minesFlaggedCount);
				setData(data);
				if (minesFlaggedCount === level.mines) {
					endGame();
				}
			}
		}
	};

	const onCellClick = (x, y) => {
		if (!isGameOver) {
			const cell = data[y][x];
			if (clicks === 0) {
				console.log('first click! set cell data, can\'t have a mine on first click...');
				setMines(x, y);
				setValues(data);
			}
			console.log('clicked', x, y, cell, clicks);
			if (!cell.isFlagged) {
				if (cell.number === -1) {
					// lose
					console.error(MINE.repeat(3), 'GAME OVER', MINE.repeat(3));
					data[y][x].triggered = true;
					endGame();
				} else {
					data[y][x].isRevealed = true;
					if (cell.number === 0) {
						spreadClick(cell, data);
					}
				}
				// todo spread open 0s
				setData(data);
				if (clicks === 0) {
					startGame();
				}
			}
			setClicks(clicks + 1);
		}
	};

	const setMines = (x, y) => {
		let { mines, cols, rows } = level;
		while (mines > 0) {
			let randX = Utils.random(cols - 1);
			let randY = Utils.random(rows - 1);
			if (randX !== x && randY !== y && data[randY][randX].number > -1) {
				data[randY][randX].number = -1;
				mines--;
			}
		}
	};

	const setValues = (data) => {
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				if (data[y][x].number > -1) {
					data[y][x].number = getNeighbors(data[y][x], data).reduce((acc, n) => {
						return acc + ((n.number === -1) ? 1 : 0);
					}, 0);
				}
			}
		}
	};

	const getNeighbors = (cell, data) => {
		const neighbors = [];
		const hasTop = cell.y > 0;
		const hasBottom = cell.y < (level.rows - 1);
		const hasLeft = cell.x > 0;
		const hasRight = cell.x < (level.cols - 1);
		if (hasTop) {
			let yTop = cell.y - 1;
			// top
			neighbors.push(data[yTop][cell.x]);
			// top left
			if (hasLeft) {
				neighbors.push(data[yTop][cell.x - 1]);
			}
			// top right
			if (hasRight) {
				neighbors.push(data[yTop][cell.x + 1]);
			}
		}
		// left
		if (hasLeft) {
			neighbors.push(data[cell.y][cell.x - 1]);
		}
		// right
		if (hasRight) {
			neighbors.push(data[cell.y][cell.x + 1]);
		}
		if (hasBottom) {
			let yBottom = cell.y + 1;
			// bottom
			neighbors.push(data[yBottom][cell.x]);
			// bottom left
			if (hasLeft) {
				neighbors.push(data[yBottom][cell.x - 1]);
			}
			// bottom right
			if (hasRight) {
				neighbors.push(data[yBottom][cell.x + 1]);
			}
		}
		return neighbors;
	};

	const getNonMineNeighbors = (cell, data) => {
		return getNeighbors(cell, data).filter((c) => c.number !== -1 && !c.isRevealed && !c.isFlagged);
	};

	const spreadClick = (cell, data) => {
		// console.log('spreadClick', cell, data);
		getNonMineNeighbors(cell, data).forEach((c) => {
			data[c.y][c.x].isRevealed = true;
			if (c.number === 0) {
				spreadClick(c, data);
			}
		});
	};

	const startGame = () => {
		console.log('** start game **');
		if (!isGameOver && !timerInterval && !startTime) {
			startTime = Date.now();
			clearInterval(timerInterval);
			timerInterval = setInterval(() => {
				const newTime = Math.floor((Date.now() - startTime) / 1000);
				setTimeElapsed(Math.min(newTime, 999));
			}, 1000);
		}
	};

	const endGame = () => {
		console.log('## end game ##');
		clearInterval(timerInterval);
		timerInterval = null;
		startTime = null;
		setGameOver(true);
		reveal();
	}

	const resetGame = (callback) => {
		console.log('reset game');
		setMinesFlagged(0);
		setTimeElapsed(0);
		setGameOver(false);
		setClicks(0);
		setData(generateGameData(level));
		if (typeof callback === 'function') {
			callback();
		}
	};

	const reveal = () => {
		console.log('reveal board');
		setGameOver(true);
		setData(data.map((row) => row.map((cell) => ({
			...cell,
			isRevealed: true
		}))));
	}

	console.log('-- app render');
	return (
		<div className={`app app-${level.name.toLowerCase()}`}>
			<Menu levels={Levels}
				currentLevel={level}
				onLevelChange={onLevelChange}
				onNewGame={onNewGame} />
			<div className="app--game-wrapper" data-game-over={isGameOver}>
				<Heading minesRemaining={level.mines - minesFlagged}
					timeElapsed={timeElapsed}
					onGameStart={onGameStart}
					isGameOver={isGameOver} />
				<Board rows={level.rows}
					cols={level.cols}
					data={data}
					isGameOver={isGameOver}
					onCellClick={onCellClick}
					onMineFlag={onMineFlag} />
			</div>
		</div>
	);
}

export default app;
