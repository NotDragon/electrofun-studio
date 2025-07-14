export let profile: {
	arduino: {
		description: string;
		digital: string[][];
		analog: string[][];
		serial: number;
	};
	arduino_mega: {
		description: string;
	};
	default: any;
} = {
	arduino: {
		description: 'Arduino standard-compatible board',
		digital: [
			['1', '1'],
			['2', '2'],
			['3', '3'],
			['4', '4'],
			['5', '5'],
			['6', '6'],
			['7', '7'],
			['8', '8'],
			['9', '9'],
			['10', '10'],
			['11', '11'],
			['12', '12'],
			['13', '13'],
			['A0', 'A0'],
			['A1', 'A1'],
			['A2', 'A2'],
			['A3', 'A3'],
			['A4', 'A4'],
			['A5', 'A5']
		],
		analog: [
			['A0', 'A0'],
			['A1', 'A1'],
			['A2', 'A2'],
			['A3', 'A3'],
			['A4', 'A4'],
			['A5', 'A5']
		],
		serial: 9600
	},
	arduino_mega: {
		description: 'Arduino Mega-compatible board'
		//53 digital
		//15 analog
	},
	default: {}
};

export let setUpProfile = () => {
	profile['default'] = profile['arduino'];
};
