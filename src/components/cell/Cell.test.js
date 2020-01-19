import React from 'react';
import { shallow } from 'enzyme/build';
import Cell from './Cell';

const baseProps = {
	triggered: false,
	x: 0,
	y: 0,
	number: 3,
	isFlagged: false,
	isRevealed: false,
	onCellClick: jest.fn(),
	isGameOver: false,
	className: 'class-name',
};

describe('Cell [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<Cell {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});