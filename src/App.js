import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FLAG, MINE } from './icons';

import Menu from './components/menu/Menu';
import Heading from './components/heading/Heading';
import Board from './components/board/Board';

import Levels from './Levels';
import Utils from './Utils';
import { EVENT_GAME_START, EVENT_GAME_END } from './Events';

const initialLevel = Utils.getSavedLevel() || Levels.find((l) => l.name === 'Beginner');

function app(props) {
	const { className } = props;
	const [level, setLevel] = useState(initialLevel);
	const [minesFlagged, setMinesFlagged] = useState(0);
	const [clicks, setClicks] = useState(0);
	const [isGameOver, setGameOver] = useState(false);
	const [data, setData] = useState(Utils.generateGameData(initialLevel));


	const startGame = () => {
		console.log('** start game **');
		if (!isGameOver) {
			Utils.publish(EVENT_GAME_START, { detail: Date.now() })
		}
	};

	const endGame = () => {
		console.log('## end game ##');
		Utils.publish(EVENT_GAME_END)
		setGameOver(true);
		setData(data.map((row) => row.map((cell) => ({
			...cell,
			isRevealed: true
		}))));
	};

	const resetGame = () => {
		console.log('reset game');
		setMinesFlagged(0);
		Utils.publish(EVENT_GAME_END, { detail: 'reset' })
		setGameOver(false);
		setClicks(0);
		setData(Utils.generateGameData(level));
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
		setData(Utils.generateGameData(newLevel));
		Utils.saveLevel(newLevel);
	};

	const onMineFlag = (x, y) => {
		if (!isGameOver) {
			if (clicks === 0) {
				console.log('First click! set cell data, can\'t have a mine on first click...');
				Utils.setMines(level, x, y, data);
				Utils.setValues(level, data);
			}
			const cell = data[y][x];
			const wasFlagged = cell.isFlagged;
			console.log(FLAG, x, y, minesFlagged, cell.isFlagged);
			if (!cell.isRevealed) {
				data[y][x].isFlagged = !wasFlagged;
				const minesFlaggedCount = minesFlagged + ((wasFlagged) ? -1 : 1);
				setMinesFlagged(minesFlaggedCount);
				setData(Array.from(data));
				if (minesFlaggedCount === level.mines) {
					endGame();
				}
			}
			setClicks(clicks + 1);
		}
	};

	const onCellClick = (x, y) => {
		if (!isGameOver) {
			const cell = data[y][x];
			if (clicks === 0) {
				console.log('First click! set cell data, can\'t have a mine on first click...');
				Utils.setMines(level, x, y, data);
				Utils.setValues(level, data);
			}
			console.log('clicked', x, y, cell, clicks);
			if (!cell.isFlagged) {
				if (Utils.isMine(cell)) {
					console.error(MINE.repeat(3), 'GAME OVER', MINE.repeat(3));
					data[y][x].triggered = true;
					endGame();
				} else {
					data[y][x].isRevealed = true;
					if (Utils.isEmpty(cell)) {
						Utils.spreadClick(level, cell, data);
					}
				}
				setData(Array.from(data));
				if (clicks === 0) {
					startGame();
				}
			}
			setClicks(clicks + 1);
		}
	};

	const onClearCell = (x, y) => {
		if (!isGameOver && clicks > 0) {
			const cell = data[y][x];
			if (!cell.isRevealed || cell.isFlagged) {
				return;
			}
			const onMine = (mineX, mineY) => {
				console.error(MINE.repeat(3), 'GAME OVER', MINE.repeat(3), mineX, mineY);
				endGame();
			};
			if (Utils.isMine(cell)) {
				data[y][x].triggered = true;
				onMine(x, y);
			} else {
				Utils.spreadClear(level, cell, data, onMine);
			}
			setData(Array.from(data));
			// setClicks(clicks + 1); // hack to force render
		}
	};

	console.log('-- app render', minesFlagged, level.mines);
	return (
		<div className={`${className} app app--${level.name.toLowerCase()}`}>
			<Menu levels={Levels}
				currentLevel={level}
				onLevelChange={onLevelChange}
				onNewGame={onNewGame} />
			<div className="app__game-wrapper" data-game-over={isGameOver}>
				<Heading minesRemaining={level.mines - minesFlagged}
					isGameOver={isGameOver}
					onNewGame={onNewGame} />
				<Board rows={level.rows}
					cols={level.cols}
					data={data}
					onClearCell={onClearCell}
					onCellClick={onCellClick}
					onMineFlag={onMineFlag}
					isGameOver={isGameOver} />
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
