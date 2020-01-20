import React from 'react';
import { shallow } from 'enzyme/build';
import Menu from './Menu';
import Levels from '../../Levels';

const baseProps = {
	levels: Levels,
	currentLevel: Levels[0],
	onLevelChange: jest.fn(),
	onNewGame: jest.fn(),
	className: 'class-name',
};

describe('Menu [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<Menu {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});