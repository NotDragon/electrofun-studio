import * as Blockly from 'blockly';
import { Arduino, Order } from './util';

Arduino.forBlock['controls_for'] = (block) => {
	// For loop.
	let variable0 = Arduino.nameDB_?.getName(
		block.getFieldValue('VAR'),
		Blockly.Variables.CATEGORY_NAME
	) || '0';
	let argument0 =
	Arduino.valueToCode(block, 'FROM', Order.ASSIGNMENT) || '0';
	let argument1 = Arduino.valueToCode(block, 'TO', Order.ASSIGNMENT) || '0';
	let branch = Arduino.statementToCode(block, 'DO');
	if (Arduino.INFINITE_LOOP_TRAP) {
		branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
	}
	let code;
	if (argument0.match(/^-?\d+(\.\d+)?$/) && argument1.match(/^-?\d+(\.\d+)?$/)) {
		// Both arguments are simple numbers.
		let up = parseFloat(argument0) <= parseFloat(argument1);
		code =
			'for(' +
			variable0 +
			' = ' +
			argument0 +
			'; ' +
			variable0 +
			(up ? ' <= ' : ' >= ') +
			argument1 +
			'; ' +
			variable0 +
			(up ? '++' : '--') +
			') {\n' +
			branch +
			'}\n';
	} else {
		code = '';
		// Cache non-trivial values to variables to prevent repeated look-ups.
		let startlet = argument0;
		if (!argument0.match(/^\w+$/) && !argument0.match(/^-?\d+(\.\d+)?$/)) {
			let startlet = Arduino.nameDB_?.getDistinctName(
				variable0 + '_start',
				Blockly.Variables.VAR_LETTER_OPTIONS
			);
			code += 'int ' + startlet + ' = ' + argument0 + ';\n';
		}
		let endlet = argument1;
		if (!argument1.match(/^\w+$/) && !argument1.match(/^-?\d+(\.\d+)?$/)) {
			let endlet = Arduino.nameDB_?.getDistinctName(
				variable0 + '_end',
				Blockly.Variables.VAR_LETTER_OPTIONS
			);
			code += 'int ' + endlet + ' = ' + argument1 + ';\n';
		}
		code +=
			'for(' +
			variable0 +
			' = ' +
			startlet +
			';\n' +
			'    (' +
			startlet +
			' <= ' +
			endlet +
			') ? ' +
			variable0 +
			' <= ' +
			endlet +
			' : ' +
			variable0 +
			' >= ' +
			endlet +
			';\n' +
			'    ' +
			variable0 +
			' += (' +
			startlet +
			' <= ' +
			endlet +
			') ? 1 : -1) {\n' +
			branch +
			'}\n';
	}
	return code;
};

Arduino.forBlock['controls_whileUntil'] = (block) => {
	// Do while/until loop.
	let until = block.getFieldValue('MODE') == 'UNTIL';
	let argument0 =
	Arduino.valueToCode(
			block,
			'BOOL',
			until ? Order.UNARY_PREFIX : Order.NONE
		) || 'false';
	let branch = Arduino.statementToCode(block, 'DO');
	if (Arduino.INFINITE_LOOP_TRAP) {
		branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
	}
	if (until) {
		argument0 = '!' + argument0;
	}
	return 'while (' + argument0 + ') {\n' + branch + '}\n';
};
