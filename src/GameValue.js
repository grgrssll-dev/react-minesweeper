import React, { PureComponent } from 'react';
import './GameValue.css';

import Utils from './Utils';

class GameValue extends PureComponent {

	render() {
		const { value } = this.props;
		return (
			<div className="menu-number">
				<span>{Utils.padLeft(value, 3, '0')}</span>
			</div>
		);
	}
}

export default GameValue;
