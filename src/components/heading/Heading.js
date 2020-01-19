import React from 'react';
import styled from '@emotion/styled';

import GameValue from '../gameValue/GameValue';

function heading(props) {
	console.log('-- heading render');
	const { minesRemaining, timeElapsed, isGameOver, onGameStart } = props;

	return (
		<div className={`${props.className} heading`}>
			<div className="heading__mines-remaining">
				<GameValue value={minesRemaining} />
			</div>
			<div className="heading__spread">
				<span className="heading__game-indicator"
					role="img"
					aria-label={isGameOver ? 'New Game' : 'Game in progress'}
					onClick={onGameStart}>{isGameOver ? '😎' : '😀'}</span>
			</div>
			<div className="heading__time-elapsed">
				<GameValue value={timeElapsed} />
			</div>
		</div >
	);
}

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
		margin: 0 auto;
		padding: 0.125rem;
		text-align: center;
		width: 1.5rem;
	}
`;
