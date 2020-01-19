import React from 'react';
import './Heading.css';

import GameValue from '../gameValue/GameValue';

function heading(props) {
	console.log('-- heading render');
	const { minesRemaining, timeElapsed, isGameOver, onGameStart } = props;

	return (
		<div className="heading">
			<div className="heading--mines-remaining">
				<GameValue value={minesRemaining} />
			</div>
			<div className="heading--spread">
				<span className="heading--game-indicator"
					role="img"
					aria-label={isGameOver ? 'New Game' : 'Game in progress'}
					onClick={onGameStart}>{isGameOver ? '😎' : '😀'}</span>
			</div>
			<div className="heading--time-elapsed">
				<GameValue value={timeElapsed} />
			</div>
		</div >
	);
}

export default heading;
