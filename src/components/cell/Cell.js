import React from 'react';
import { FLAG, ERROR, MINE } from '../../icons';
import './Cell.css';

function cell(props) {
	const {
		triggered,
		x,
		y,
		number,
		isFlagged,
		isRevealed,
		onCellClick,
		isGameOver,
	} = props;

	const getValue = () => {
		if (isFlagged && number !== -1 && isGameOver) {
			return (<span role="img" aria-label="error">{ERROR}</span>);
		} else if (isFlagged) {
			return (<span role="img" aria-label="flag">{FLAG}</span>);
		} else if (number === -1) {
			return (<span role="img" aria-label="mine">{MINE}</span>);
		} else if (number < 9 && number > 0) {
			return number;
		} else {
			return ' ';
		}
	}

	const isRightClick = (e) => {
		return (e.type === 'click' && (e.button === 2 || e.which === 3));
	}

	// console.log('-- cell render', y, x);
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
				{getValue()}
			</div>
		</div>
	);
}

export default cell;
