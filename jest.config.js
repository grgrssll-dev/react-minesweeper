process.env.NODE_ENV = 'test';
process.env.LOGS_PATH = 'logs';
module.exports = {
	collectCoverage: true,
	coveragePathIgnorePatterns: [
		'/jest/',
		'/node_modules/',
	],
	//   globals: {
	//     __DEVELOPMENT__: true,
	//     __TEST__: true,
	//   },
	testEnvironment: 'node',
	verbose: true,
};
