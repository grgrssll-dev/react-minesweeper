import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FLAG, ERROR, MINE } from '../../icons';

const Buttons = {
	LEFT_CLICK: 0,
	RIGHT_CLICK: 2,
};

function cell(props) {
	const [isRightDown, setRightDown] = useState(false);
	const [didLeftClick, setDidLeftClick] = useState(false);

	const {
		triggered,
		x,
		y,
		number,
		isFlagged,
		isRevealed,
		onCellClick,
		onClearCell,
		isGameOver,
		className,
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
	};

	const onMouseDown = (e) => {
		switch (e.button) {
			case Buttons.LEFT_CLICK:
				// setLeftDown(true);
				break;
			case Buttons.RIGHT_CLICK:
				setRightDown(true);
				break;
			default:
				break;
		}
		// console.log('DOWN', e.button, e.buttons, e.which, e.altKey, e.ctrlKey, e.metaKey);
	};

	const onMouseUp = (e) => {
		switch (e.button) {
			case Buttons.LEFT_CLICK:
				if (isRightDown) {
					setDidLeftClick(true);
					console.log('Will Do Click Spread');
				} else {
					setDidLeftClick(true);
					onCellClick(false, x, y)
				}
				break;
			case Buttons.RIGHT_CLICK:
				if (didLeftClick) {
					console.log('Do Click Spread');
					onClearCell(x, y);
				} else {
					onCellClick(true, x, y)
				}
				setRightDown(false);
				setDidLeftClick(false);
				break;
			default:
				break;
		}
		console.log('UP', e.button, e.buttons, e.which, e.altKey, e.ctrlKey, e.metaKey);
	};

	// console.log('-- cell render', y, x);
	return (
		<button className={`${className} cell ${triggered ? 'cell--triggered' : ''}`}
			type="button"
			data-number={number}
			onMouseDown={(e) => {
				onMouseDown(e);
			}}
			onMouseUp={(e) => {
				onMouseUp(e);
			}}
			onContextMenu={(e) => {
				e.preventDefault();
			}}>
			<span className="cell__inner"
				data-revealed={isRevealed}
				data-flagged={isFlagged}>
				{getValue()}
			</span>
		</button>
	);
}

cell.propTypes = {
	triggered: PropTypes.bool.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	number: PropTypes.number.isRequired,
	isFlagged: PropTypes.bool.isRequired,
	isRevealed: PropTypes.bool.isRequired,
	onCellClick: PropTypes.func.isRequired,
	onClearCell: PropTypes.func.isRequired,
	isGameOver: PropTypes.bool.isRequired,
	className: PropTypes.string.isRequired,
};

export default styled(cell)`
	background: var(--game-bg);
	box-sizing: border-box;
	border: 0.0625rem var(--grid-color) solid;
	border-top: 0;
	border-left: 0;
	padding: 0;
	cursor: default;
	display: inline-block;
	font-size: 1rem;
	height: 1rem;
	width: 1rem;
	vertical-align: top;

	.cell__inner {
		border-bottom-color: var(--game-border-dark);
		border-left-color: var(--game-border-light);
		border-right-color: var(--game-border-dark);
		border-style: solid;
		border-top-color: var(--game-border-light);
		border-width: 0.125rem;
		box-sizing: border-box;
		color: transparent;
		cursor: default;
		display: block;
		font-family: 'VT323', monospace;
		font-size: 1.25rem;
		height: calc(1rem - 0.0625rem);
		line-height: 0.8;
		text-align: center;
		width: calc(1rem - 0.0625rem);
	}

	.cell__inner[data-revealed="true"][data-flagged="false"] {
		border-width: 0;
	}

	&[data-number="0"] [data-revealed="true"] {
		color: rgba(0, 0, 0, 0.2);
	}

	&[data-number="1"] [data-revealed="true"] {
		color: var(--val-1);
	}

	&[data-number="2"] [data-revealed="true"] {
		color: var(--val-2);
	}

	&[data-number="3"] [data-revealed="true"] {
		color: var(--val-3);
	}

	&[data-number="4"] [data-revealed="true"] {
		color: var(--val-4);
	}

	&[data-number="5"] [data-revealed="true"] {
		color: var(--val-5);
	}

	&[data-number="6"] [data-revealed="true"] {
		color: var(--val-6);
	}

	&[data-number="7"] [data-revealed="true"] {
		color: var(--val-7);
	}

	&[data-number="8"] [data-revealed="true"] {
		color: var(--val-8);
	}

	& [data-flagged="true"] {
		color: var(--system-text);
		font-size: 0.5rem;
		line-height: 1.6;
	}

	[data-game-over="true"] &[data-number="-1"] .cell__inner {
		color: var(--system-text);
		font-size: 0.6rem;
		line-height: 1.6;
	}

	&.cell--triggered .cell__inner {
		border: 0;
		background: var(--error);
	}
`;
