import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

function bestScores(props) {
	const {
		onClose,
		className,
	} = props;

	const onClick = () => {
		onClose();
	}

	console.log('-- bestScores render');
	return (
		<div className={`${className} best-scores`}>
			<h1 className="best-scores__title">Best Scores</h1>
			<button onClick={onClick} type="button">close</button>
		</div>
	);
}

bestScores.propTypes = {
	onClose: PropTypes.func.isRequired,
	className: PropTypes.string.isRequired,
}

export default styled(bestScores)`
	position: fixzed;
	width: 10rem;
	height: 10rem;
	left: calc(100% - 5rem);
	top: calc(100% - 5rem);
	background: var(--system-bg);

	best-scores__title {
		color: var(--system-text);
		cursor: default;
		display: inline-block;
		font-size: 0.75rem;
		line-height: 1;
		vertical-align: baseline;
	}
`;
