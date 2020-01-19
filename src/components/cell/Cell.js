import React from 'react';
import './Cell.css';

function cell(props) {
	const {
		triggered,
		x,
		y,
		number,
		isFlagged,
		isRevealed,
		onCellClick
	} = props;

	const getValue = (number, isFlagged) => {
		if (isFlagged) {
			return (<span role="img" aria-label="flag">🚩</span>);
		} else if (number === -1) {
			return (<span role="img" aria-label="mine">💣</span>);
		} else if (number < 9 && number > 0) {
			return number;
		} else {
			return ' ';
		}
	}

	const isRightClick = (e) => {
		return (e.type === 'click' && (e.button === 2 || e.which === 3));
	}

	console.log('-- cell render', y, x);
	return (
		<div className={`cell ${triggered ? 'cell-triggered' : ''}`}
			data-number={number}
			onClick={(e) => {
				onCellClick(isRightClick(e), x, y);
				e.preventDefault();
			}}
			onContextMenu={(e) => {
				onCellClick(true, x, y);
				e.preventDefault();
			}}>
			<div className="cell--inner"
				data-revealed={isRevealed}
				data-flagged={isFlagged}>
				{getValue(number, isFlagged)}
			</div>
		</div>
	);
}

export default cell;
