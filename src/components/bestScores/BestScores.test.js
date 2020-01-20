import React from 'react';
import { shallow } from 'enzyme/build';
import BestScores from './BestScores';

const baseProps = {
	className: 'class-name',
};

describe('BestScores [Unit]', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should match component snapshot', () => {
		expect.assertions(1);
		const props = {
			...baseProps,
		};
		const wrapper = shallow(<BestScores {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});