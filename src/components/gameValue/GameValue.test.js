import React from 'react';
import { shallow } from 'enzyme/build';
import GameValue from './GameValue';

const baseProps = {
	value: 123,
	className: 'class-name',
};

describe('GameValue [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<GameValue {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});