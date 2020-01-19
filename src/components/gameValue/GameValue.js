import React from 'react';
import './GameValue.css';

function gameValue(props) {
	const { value } = props;
	return (
		<div className="menu-number">
			<span>{`${value || ''}`.padStart(3, '0')}</span>
		</div>
	);
}

export default gameValue;
