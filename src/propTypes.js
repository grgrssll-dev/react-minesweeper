import PropTypes from 'prop-types';

export const levelType = PropTypes.shape({
	name: PropTypes.string.isRequired,
	rows: PropTypes.number.isRequired,
	cols: PropTypes.number.isRequired,
	mines: PropTypes.number.isRequired,
});

export const cellDataType = PropTypes.shape({
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	isRevealed: PropTypes.bool.isRequired,
	isFlagged: PropTypes.bool.isRequired,
	number: PropTypes.number.isRequired,
	triggered: PropTypes.bool.isRequired,
});