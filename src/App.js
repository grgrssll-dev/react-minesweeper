import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FLAG, MINE } from './icons';

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

function app(props) {
	const { className } = props;
	const [level, setLevel] = useState(initialLevel);
	const [minesFlagged, setMinesFlagged] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [clicks, setClicks] = useState(0);
	const [isGameOver, setGameOver] = useState(false);
	const [data, setData] = useState(generateGameData(initialLevel));

	const reveal = () => {
		console.log('reveal board');
		setGameOver(true);
		setData(data.map((row) => row.map((cell) => ({
			...cell,
			isRevealed: true
		}))));
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

	const onNewGame = () => {
		console.log('new game');
		endGame();
		resetGame();
	};

	const onLevelChange = (newLevel) => {
		console.log('level change', newLevel);
		onNewGame();
		setLevel(newLevel);
		setData(generateGameData(newLevel));
		localStorage.setItem(LEVEL_LABEL, JSON.stringify(newLevel));
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

	const setMines = (x, y) => {
		const { cols, rows } = level;
		let { mines } = level;
		while (mines > 0) {
			const randX = Utils.random(cols - 1);
			const randY = Utils.random(rows - 1);
			if (randX !== x && randY !== y && data[randY][randX].number > -1) {
				data[randY][randX].number = -1;
				mines--;
			}
		}
	};

	const getNeighbors = (cell, gameData) => {
		const neighbors = [];
		const hasTop = cell.y > 0;
		const hasBottom = cell.y < (level.rows - 1);
		const hasLeft = cell.x > 0;
		const hasRight = cell.x < (level.cols - 1);
		if (hasTop) {
			const yTop = cell.y - 1;
			// top
			neighbors.push(gameData[yTop][cell.x]);
			// top left
			if (hasLeft) {
				neighbors.push(gameData[yTop][cell.x - 1]);
			}
			// top right
			if (hasRight) {
				neighbors.push(gameData[yTop][cell.x + 1]);
			}
		}
		// left
		if (hasLeft) {
			neighbors.push(gameData[cell.y][cell.x - 1]);
		}
		// right
		if (hasRight) {
			neighbors.push(gameData[cell.y][cell.x + 1]);
		}
		if (hasBottom) {
			const yBottom = cell.y + 1;
			// bottom
			neighbors.push(gameData[yBottom][cell.x]);
			// bottom left
			if (hasLeft) {
				neighbors.push(gameData[yBottom][cell.x - 1]);
			}
			// bottom right
			if (hasRight) {
				neighbors.push(gameData[yBottom][cell.x + 1]);
			}
		}
		return neighbors;
	};

	const setValues = (gameData) => {
		for (let y = 0; y < gameData.length; y++) {
			for (let x = 0; x < gameData[y].length; x++) {
				if (gameData[y][x].number > -1) {
					/* eslint-disable no-param-reassign */
					gameData[y][x].number = getNeighbors(gameData[y][x], gameData).reduce((acc, n) => {
						return acc + ((n.number === -1) ? 1 : 0);
					}, 0);
					/* eslint-enable no-param-reassign */
				}
			}
		}
	};

	const getNonMineNeighbors = (cell, gameData) => {
		return getNeighbors(cell, gameData).filter((c) => c.number !== -1 && !c.isRevealed && !c.isFlagged);
	};

	const spreadClick = (cell, gameData) => {
		// console.log('spreadClick', cell, gameData);
		getNonMineNeighbors(cell, gameData).forEach((c) => {
			/* eslint-disable no-param-reassign */
			gameData[c.y][c.x].isRevealed = true;
			if (c.number === 0) {
				spreadClick(c, gameData);
			}
			/* eslint-enable no-param-reassign */
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

	console.log('-- app render');
	return (
		<div className={`${className} app app--${level.name.toLowerCase()}`}>
			<Menu levels={Levels}
				currentLevel={level}
				onLevelChange={onLevelChange}
				onNewGame={onNewGame} />
			<div className="app__game-wrapper" data-game-over={isGameOver}>
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

app.propTypes = {
	className: PropTypes.string.isRequired,
};

export default styled(app)`
	border: 0.0625rem var(--system-bg) solid;
	display: inline-block;
	width: auto;
	user-select: none;

	.app__game-wrapper {
		background: var(--game-bg);
		border-color: var(--game-border-light);
		border-style: solid;
		border-left-width: 0.1875rem;
		border-top-width: 0.1875rem;
		border-right-width: 0;
		border-bottom-width: 0;
		padding: 0.375rem;
	}

	&.app--expert {
		width: 31.3125rem;
		height: 21.0625rem;
	}

	&.app--intermediate {
		width: 17.3125rem;
		height: 21.0625rem;
	}

	&.app--beginner {
		width: 11.3125rem;
		height: 15.0625rem;
	}
`;
