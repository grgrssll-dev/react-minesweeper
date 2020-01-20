import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SMILEY, SUNGLASSES } from '../../icons';
import Utils from '../../Utils';
import GameValue from '../gameValue/GameValue';
import { EVENT_GAME_START, EVENT_GAME_END } from '../../Events';

let startTime = null;
let timerInterval = null;

function heading(props) {
	console.log('-- heading render');
	const {
		minesRemaining,
		isGameOver,
		onNewGame,
		className,
	} = props;

	const [time, setTime] = useState(0);

	const onGameStart = (e) => {
		startTime = e.detail;
		clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			const newTime = Math.floor((Date.now() - startTime) / 1000);
			setTime(Math.min(newTime, 999));
		}, 1000);
	};

	const onGameEnd = (e) => {
		startTime = null;
		clearInterval(timerInterval);
		if (e.detail === 'reset') {
			setTime(0);
		}
	};

	useEffect(() => {
		Utils.subscribe(EVENT_GAME_START, onGameStart);
		Utils.subscribe(EVENT_GAME_END, onGameEnd);
		return function cleanup() {
			Utils.unsubscribe(EVENT_GAME_START, onGameStart);
			Utils.unsubscribe(EVENT_GAME_END, onGameEnd);
		};
	}, [startTime]);

	return (
		<div className={`${className} heading`}>
			<div className="heading__mines-remaining">
				<GameValue value={minesRemaining} />
			</div>
			<div className="heading__spread">
				<button
					className="heading__game-button"
					onClick={onNewGame}
					type="button">
					<span className="heading__game-indicator"
						role="img"
						aria-label={isGameOver ? 'New Game' : 'Game in progress'}
					>{isGameOver ? SUNGLASSES : SMILEY}</span>
				</button>
			</div>
			<div className="heading__time-elapsed">
				<GameValue value={time} />
			</div>
		</div >
	);
}

heading.propTypes = {
	minesRemaining: PropTypes.number.isRequired,
	isGameOver: PropTypes.bool.isRequired,
	onNewGame: PropTypes.func.isRequired,
	className: PropTypes.string.isRequired,
};

export default styled(heading)`
	border-bottom-color: var(--game-border-light);
	border-left-color: var(--game-border-dark);
	border-right-color: var(--game-border-light);
	border-style: solid;
	border-top-color: var(--game-border-dark);
	border-width: 0.125rem;
	padding: 0.25rem;

	.heading__mines-remaining {
		display: inline-block;
		vertical-align: middle;
	}

	.heading__time-elapsed {
		display: inline-block;
		vertical-align: middle;
	}

	.heading__spread {
		display: inline-block;
		vertical-align: middle;
		width: calc(100% - 5rem);
	}

	.heading__game-button {
		background: var(--game-bg);
		border: 0;
		display: block;
		height: 1.5rem;
		margin: 0 auto;
		padding: 0;
		width: 1.5rem;
	}

	.heading__game-indicator {
		cursor: default;
		display: block;
		border-width: 0.125rem;
		border-style: solid;
		border-top-color: var(--game-border-light);
		border-left-color: var(--game-border-light);
		border-right-color: var(--game-border-dark);
		border-bottom-color: var(--game-border-dark);
		box-sizing: border-box;
		font-size: 1rem;
		height: 1.5rem;
		line-height: 1;
		padding: 0.125rem;
		text-align: center;
		width: 1.5rem;
	}
`;
