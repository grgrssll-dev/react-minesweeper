process.env.NODE_ENV = 'test';
process.env.LOGS_PATH = 'logs';
module.exports = {
	collectCoverage: true,
	coveragePathIgnorePatterns: [
		'/jest/',
		'/node_modules/',
	],
	testEnvironment: 'jsdom',
	verbose: true,
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/lib/',
	],
	setupFilesAfterEnv: ['<rootDir>/tests/enzymeConfig.js'],
	snapshotSerializers: ['enzyme-to-json/serializer'],
};
