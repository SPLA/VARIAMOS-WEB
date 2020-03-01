let customBoards = [
	{
		name: "ArduinoUNO",
		digitalPins: [
			"D2", "D4", "D7",
			"D8", "D12", "D13"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3", "A4", "A5"
		],
		pwmPins: [
			"P3", "P5", "P6", 
			"P9", "P10", "P11"
		]
	},
	{
		name: "ArduinoNANO",
		digitalPins: [
			"D2", "D3", "D4",
			"D5", "D7", "D10",
			"D11"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3", "A4", "A5",
			"A6", "A7"
		],
		pwmPins: [
			"P6", "P8", "P9",
			"P12", "P13", "P14"
		]
	},
	{
		name: "ArduinoMEGA",
		digitalPins: [
			"D0", "D1", "D14",
			"D15", "D16", "D17",
			"D18", "D19", "D20",
			"D21", "D22", "D23",
			"D24", "D25", "D26",
			"D27", "D28", "D29",
			"D30", "D31", "D32",
			"D33", "D34", "D35",
			"D36", "D37", "D38",
			"D39", "D40", "D41",
			"D42", "D43", "D44",
			"D45", "D46", "D47",
			"D48", "D49", "D50",
			"D51", "D52", "D53"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3", "A4", "A5",
			"A6", "A7", "A8",
			"A9", "A10", "A11",
			"A12", "A13", "A14",
			"A15"
		],
		pwmPins: [
			"P2", "P3", "P4",
			"P5", "P6", "P7",
			"P8", "P9", "P10",
			"P11", "P12", "P13",
		]
	}
];

export function getBoards() {

    return customBoards;
}

export function getBoard(boardName) { 
    for(let board of customBoards) {
        if(board.name==boardName){
            return board;
        }
    }
    return null;
}  