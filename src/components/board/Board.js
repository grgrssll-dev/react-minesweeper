import React from 'react';
import './Board.css';
import Cell from '../cell/Cell';

function board(props) {
	const { rows, cols, data, isGameOver } = props;

	const onCellClick = (isRightClick, x, y) => {
		const { onCellClick, onMineFlag } = props;
		if (!isGameOver) {
			if (isRightClick) {
				onMineFlag(x, y);
			} else {
				onCellClick(x, y);
			}
		}
	}

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
							isGameOver={isGameOver}
							number={cell.number}
							isFlagged={cell.isFlagged}
							isRevealed={cell.isRevealed}
							onCellClick={onCellClick} />
					);
				}).concat((<br key={`br-${x}`} />));
			})}
		</div>
	);
}

export default board;
