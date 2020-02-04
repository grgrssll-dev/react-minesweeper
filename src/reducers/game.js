export const GameStatus = {
	Error: -1,
	Idle: 0,
	InProgress: 1,
	Over: 2,
};

export const GameOverStatus = {
	Win: 1,
	Loss: 0,
};

export const ACTION_GAME_RESET = 'game.reset';
export const ACTION_GAME_START = 'game.start';
export const ACTION_GAME_OVER = 'game.over';

export default function minesReducer(state, action) {
	switch (action.type) {
		case ACTION_GAME_RESET:
			return {
				winLoss: null,
				status: GameStatus.Idle,
			};
		case ACTION_GAME_START:
			return {
				winLoss: null,
				status: GameStatus.InProgress,
			};
		case ACTION_GAME_OVER:
			return {
				...state,
				status: GameStatus.Over,
				winLoss: action.payload,
			};
		default:
			throw new Error();
	}
}