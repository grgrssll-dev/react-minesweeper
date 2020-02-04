export const ACTION_MINES_USED_INCREMENT = 'mines.used.increment';
export const ACTION_MINES_USED_DECREMENT = 'mines.used.decrement';
export const ACTION_MINES_RESET = 'mines.all.reset';

export default function minesReducer(state, action) {
	switch (action.type) {
		case ACTION_MINES_USED_INCREMENT:
			return {
				...state,
				minesUsed: state.minesUsed + 1
			};
		case ACTION_MINES_USED_DECREMENT:
			return {
				...state,
				minesUsed: state.minesUsed - 1
			};
		case ACTION_MINES_RESET:
			return {
				...state,
				totalMines: action.payload,
				minesUsed: 0,
			};
		default:
			throw new Error();
	}
}