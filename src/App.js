import React, { Component } from 'react';
import './App.css';

import Menu from './Menu';
import Heading from './Heading';
import Board from './Board';

import Levels from './Levels';
import Utils from './Utils';

const defaultLevel = Levels.beginner;
const LEVEL_LABEL = 'DEFAULT_LEVEL';

class App extends Component {

	constructor(props) {
		super(props);

		let savedLevel = localStorage.getItem(LEVEL_LABEL);
		if (savedLevel) {
			try {
				savedLevel = JSON.parse(savedLevel);
			} catch (err) {
				savedLevel = null;
			}
		}

		const initialLevel = savedLevel || defaultLevel;

		this.state = {
			level: initialLevel,
			minesFlagged: 0,
			timeElapsed: 0,
			isGameOver: false,
			clicks: 0,
			data: this._generateGameData(initialLevel)
		};

		this._timerInterval = null;

		this._onLevelChangeBound = this._onLevelChange.bind(this);
		this._onNewGameBound = this._onNewGame.bind(this);
		this._onGameStartBound = this._onGameStart.bind(this);
		this._onCellClickBound = this._onCellClick.bind(this);
		this._onMineFlagBound = this._onMineFlag.bind(this);
	}

	_generateGameData(level) {
		let data = [];
		for (let y = 0; y < level.rows; y++) {
			let row = [];
			for (let x = 0; x < level.cols; x++) {
				row.push({
					x: x,
					y: y,
					isRevealed: false,
					isFlagged: false,
					number: 0
				});
			}
			data.push(row);
		}
		return data;
	}

	_onLevelChange(newLevel) {
		console.log('level change', newLevel);
		this.setState({
			level: newLevel,
			data: this._generateGameData(newLevel)
		});
		localStorage.setItem(LEVEL_LABEL, JSON.stringify(newLevel));
	}

	_onNewGame() {
		console.log('new game');
		this._endGame(false);
		this._resetGame(this._startGame.bind(this));
	}

	_onGameStart() {
		this._onNewGame();
	}

	_onMineFlag(x, y) {
		console.log('@ flag', x, y);
		const { data, level } = this.state;
		const cell = data[y][x];
		const wasFlagged = cell.isFlagged;
		if (!cell.isRevealed) {
			data[y][x].isFlagged = !wasFlagged;
			const countStep = (wasFlagged) ? -1 : 1;
			this.setState((state) => {
				return {
					minesFlagged: state.minesFlagged + countStep,
					data: data.slice()
				};
			}, () => {
				if (this.state.minesFlagged === level.mines) {
					this._endGame(true);
				}
			});
		}
	}

	_onCellClick(x, y) {
		this.setState((state) => {
			return {
				clicks: state.clicks + 1
			};
		}, () => {
			let { data, clicks } = this.state;
			const clickCount = clicks;
			if (clickCount === 1) {
				console.log('first click! set cell data, can\'t have a mine on first click...');
				data = this._setMines(x, y);
				data = this._setValues(data);
			}
			console.log('clicked', x, y, data[y][x]);
			if (!data[y][x].isFlagged) {
				const number = data[y][x].number;
				if (number === -1) {
					// lose
					console.error('bombs away');
					data[y][x].triggered = true;
					this._endGame(true);
				} else {
					data[y][x].isRevealed = true;
					if (number === 0) {
						data = this._spreadClick(data[y][x], data);
					}
				}
				// todo spread open 0s
				this.setState({
					data: Array.from(data)
				}, () => {
					if (clickCount === 1) {
						this._startGame();
					}
				});
			}
		})
	}

	_setMines(x, y) {
		const { level, data } = this.state;
		let mines = level.mines;
		while (mines > 0) {
			let randX = Utils.random(level.cols - 1);
			let randY = Utils.random(level.rows - 1);
			if (randX !== x && randY !== y && data[randY][randX].number > -1) {
				data[randY][randX].number = -1;
				mines--;
			}
		}
		return data;
	}

	_setValues(data) {
		return data.map((row, x) => {
			return row.map((cell, y) => {
				if (cell.number > -1) {
					const neighbors = this._getNeighbors(cell, data);
					cell.number = neighbors.reduce((acc, n) => {
						return acc + ((n.number === -1) ? 1 : 0);
					}, 0);
				}
				return cell;
			});
		});
	}

	_getNeighbors(cell, data) {
		const { level } = this.state;
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
	}

	_getNonMineNeighbors(cell, data) {
		return this._getNeighbors(cell, data).filter((c) => c.number !== -1 && !c.isRevealed && !c.isFlagged);
	}

	_spreadClick(cell, data) {
		this._getNonMineNeighbors(cell, data).forEach((c) => {
			data[c.y][c.x].isRevealed = true;
			if (c.number === 0) {
				data = this._spreadClick(c, data);
			}
		});
		return data;
	}

	_startGame() {
		console.log('start game');
		const { isGameOver } = this.state;
		if (!isGameOver && !this._timerInterval) {
			this._timerInterval = setInterval(() => {
				this.setState((state) => {
					return {
						timeElapsed: state.timeElapsed + 1
					};
				});
			}, 1000);
		}
	}

	_endGame(reveal) {
		console.log('end game');
		clearInterval(this._timerInterval);
		this._timerInterval = null;
		this.setState({
			isGameOver: true
		}, () => {
			if (reveal) {
				this._reveal();
			}
		});
	}

	_resetGame(callback) {
		console.log('reset game');
		this.setState({
			minesFlagged: 0,
			timeElapsed: 0,
			isGameOver: false,
			clicks: 0,
			data: this._generateGameData(this.state.level)
		}, callback);
	}

	_reveal() {
		console.log('reveal board');
		const { data } = this.state;
		this.setState({
			isGameOver: true,
			data: data.map((row) => {
				return row.map((cell) => {
					cell.isRevealed = true;
					return cell;
				});
			})
		});
	}

	render() {
		const { data, level, minesFlagged, timeElapsed, isGameOver } = this.state;
		console.log('-- app render');
		return (
			<div className="app">
				<Menu levels={Levels}
					currentLevel={level}
					onLevelChange={this._onLevelChangeBound}
					onNewGame={this._onNewGameBound} />
				<div className="app--game-wrapper" data-game-over={isGameOver}>
					<Heading minesRemaining={level.mines - minesFlagged}
						timeElapsed={timeElapsed}
						onGameStart={this._onGameStartBound}
						isGameOver={isGameOver} />
					<Board rows={level.rows}
						cols={level.cols}
						data={data}
						onCellClick={this._onCellClickBound}
						onMineFlag={this._onMineFlagBound} />
				</div>
			</div>
		);
	}
}

export default App;
