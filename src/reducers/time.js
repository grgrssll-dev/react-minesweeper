export const ACTION_TIME_RESET = 'time.reset';
export const ACTION_TIME_INCREMENT = 'time.increment';

export default function minesReducer(state, action) {
	switch (action.type) {
		case ACTION_TIME_INCREMENT:
			return state + 1;
		case ACTION_TIME_RESET:
			return 0;
		default:
			throw new Error();
	}
}