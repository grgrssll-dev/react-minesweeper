import React, { Component } from 'react';
import './Board.css';
import Cell from './Cell';

class Board extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clicks: 0
		};
		this._onCellClickBound = this._onCellClick.bind(this);
	}

	_onCellClick(isRightClick, x, y) {
		const { onCellClick, onMineFlag } = this.props;
		if (isRightClick) {
			onMineFlag(x, y);
		} else {
			this.setState((state) => {
				return {
					clicks: state.clicks + 1
				};
			}, () => {
				onCellClick(x, y);
			});
		}
	}

	render() {
		const { rows, cols, data } = this.props;
		console.log('-- board render', rows, cols);

		return (
			<div className="board">
				{data.map((row, x) => {
					return row.map((cell, y) => {
						return (
							<Cell key={`${x},${y}`}
								triggered={cell.triggered}
								x={cell.x}
								y={cell.y}
								number={cell.number}
								isFlagged={cell.isFlagged}
								isRevealed={cell.isRevealed}
								onCellClick={this._onCellClickBound} />
						);
					}).concat((<br key={`br-${x}`} />));
				})}
			</div>
		);
	}
}

export default Board;
