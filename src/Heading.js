import React, { PureComponent } from 'react';
import './Heading.css';

import GameValue from './GameValue';

class Heading extends PureComponent {

	render() {
		console.log('-- heading render');
		const { minesRemaining, timeElapsed, isGameOver, onGameStart } = this.props;

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
}

export default Heading;
