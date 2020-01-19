import React from 'react';
import { shallow } from 'enzyme/build';
import Board from './Board';

const baseProps = {
	rows: 10,
	cols: 10,
	data: [[]],
	onCellClick: jest.fn(),
	onMineFlag: jest.fn(),
	isGameOver: false,
	className: 'class-name',
};

describe('Board [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<Board {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});