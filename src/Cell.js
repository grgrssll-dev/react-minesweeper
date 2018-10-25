import React, { PureComponent } from 'react';
import './Cell.css';

class Cell extends PureComponent {

	_getValue(number, isFlagged) {
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

	_isRightClick(e) {
		return (e.type === 'click' && (e.button === 2 || e.which === 3));
	}

	render() {
		const { triggered, x, y, number, isFlagged, isRevealed, onCellClick } = this.props;
		const triggeredClass = triggered ? 'cell-triggered' : ''
		console.log('-- cell render', x, y);
		return (
			<div className={`cell ${triggeredClass}`}
				data-number={number}
				onClick={(e) => {
					onCellClick(this._isRightClick(e), x, y);
					e.preventDefault();
				}}
				onContextMenu={(e) => {
					onCellClick(true, x, y);
					e.preventDefault();
				}}>
				<div className="cell--inner"
					data-revealed={isRevealed}
					data-flagged={isFlagged}>
					{this._getValue(number, isFlagged)}
				</div>
			</div>
		);
	}
}

export default Cell;
