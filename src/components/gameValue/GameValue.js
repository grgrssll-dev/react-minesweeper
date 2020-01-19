import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function gameValue(props) {
	const {
		value,
		className,
	} = props;
	return (
		<div className={`${className} menu-number`}>
			<span>{`${value || ''}`.padStart(3, '0')}</span>
		</div>
	);
}

gameValue.propTypes = {
	value: PropTypes.string.isRequired,
	className: PropTypes.string.isRequired,
};

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
