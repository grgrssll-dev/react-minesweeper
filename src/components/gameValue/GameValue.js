import React from 'react';
import styled from '@emotion/styled';

function gameValue(props) {
	const { value } = props;
	return (
		<div className={`${props.className} menu-number`}>
			<span>{`${value || ''}`.padStart(3, '0')}</span>
		</div>
	);
}

export default styled(gameValue)`
	background: black;
	color: red;
	font-display: block;
    font-family: 'VT323', Monaco, monospace;
	font-size: 2rem;
	line-height: 0.7;
	height: 1.5rem;
	text-align: right;
	width: 2.5rem;
`;
