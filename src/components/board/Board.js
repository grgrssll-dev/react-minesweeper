import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Cell from '../cell/Cell';
import { cellDataType } from '../../propTypes';

function board(props) {
	const {
		rows,
		cols,
		data,
		onCellClick,
		onMineFlag,
		isGameOver,
		className,
	} = props;

	const onClick = (isRightClick, x, y) => {
		if (!isGameOver) {
			if (isRightClick) {
				onMineFlag(x, y);
			} else {
				onCellClick(x, y);
			}
		}
	}

	console.log('-- board render', rows, cols);
	/* eslint-disable react/no-array-index-key */
	return (
		<div className={`${className} board`}>
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
							onCellClick={onClick} />
					);
				}).concat((<br key={`br-${x}`} />));
			})}
		</div>
	);
	/* eslint-ensable react/no-array-index-key */
}

board.propTypes = {
	rows: PropTypes.number.isRequired,
	cols: PropTypes.number.isRequired,
	data: PropTypes.arrayOf(PropTypes.arrayOf(cellDataType)).isRequired,
	onCellClick: PropTypes.func.isRequired,
	onMineFlag: PropTypes.func.isRequired,
	isGameOver: PropTypes.bool.isRequired,
	className: PropTypes.string.isRequired,
}

export default styled(board)`
	border-bottom-color: var(--game-border-light);
	border-left-color: var(--game-border-dark);
	border-right-color: var(--game-border-light);
	border-style: solid;
	border-top-color: var(--game-border-dark);
	border-width: 0.125rem;
	font-size: 0;

	& br {
		width: 0;
		height: 0;
		display: block;
	}
`;
