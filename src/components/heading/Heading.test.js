import React from 'react';
import { shallow } from 'enzyme/build';
import Heading from './Heading';

const baseProps = {
	minesRemaining: 10,
	timeElapsed: 4,
	isGameOver: jest.fn(),
	onGameStart: jest.fn(),
	className: 'class-name',
};

describe('Heading [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<Heading {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});