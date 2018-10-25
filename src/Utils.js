const Utils = {
	padLeft(str = '', len, padChar = '0') {
		str = `${str}`;
		while (str.length < len) {
			str = padChar + str;
		}
		return str;
	},
	random(max) {
		return Math.round(Math.random() * max);
	}
};

export default Utils;