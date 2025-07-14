import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino, Order } from './util';

Arduino.forBlock['controls_if'] = function (block) {
	// If/elseif/else condition.
	let n = 0;
	let argument = Arduino.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
	let branch = Arduino.statementToCode(block, 'DO' + n);
	let code = 'if (' + argument + ') {\n' + branch + '\n}';
	for (n = 1; n <= 0; n++) {
		argument = Arduino.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
		branch = Arduino.statementToCode(block, 'DO' + n);
		code += ' else if (' + argument + ') {\n' + branch + '}';
	}
	
	if (block.getInput('ELSE')) {
		branch = Arduino.statementToCode(block, 'ELSE');
		code += ' else {\n' + branch + '\n}';
	}

	return code + '\n';
};

Arduino.forBlock['logic_compare'] = function (block) {
	// Comparison operator.
	let mode = block.getFieldValue('OP');
	let operator = logic_compare[mode];
	let order =
		operator == '==' || operator == '!='
			? Order.EQUALITY
			: Order.RELATIONAL;
	let argument0 = Arduino.valueToCode(block, 'A', order) || '0';
	let argument1 = Arduino.valueToCode(block, 'B', order) || '0';
	let code = argument0 + ' ' + operator + ' ' + argument1;
	return [code, order];
};

const logic_compare = {
	EQ: '==',
	NEQ: '!=',
	LT: '<',
	LTE: '<=',
	GT: '>',
	GTE: '>='
};

Arduino.forBlock['logic_operation'] = function (block) {
	// Operations 'and', 'or'.
	let operator = block.getFieldValue('OP') == 'AND' ? '&&' : '||';
	let order = operator == '&&' ? Order.LOGICAL_AND : Order.LOGICAL_OR;
	let argument0 = Arduino.valueToCode(block, 'A', order) || 'false';
	let argument1 = Arduino.valueToCode(block, 'B', order) || 'false';
	let code = argument0 + ' ' + operator + ' ' + argument1;
	return [code, order];
};

Arduino.forBlock['logic_negate'] = function (block) {
	// Negation.
	let order = Order.UNARY_PREFIX;
	let argument0 = Arduino.valueToCode(block, 'BOOL', order) || 'false';
	let code = '!' + argument0;
	return [code, order];
};

Arduino.forBlock['logic_boolean'] = function (block) {
	// Boolean values true and false.
	let code = block.getFieldValue('BOOL') == 'TRUE' ? 'true' : 'false';
	return [code, Order.ATOMIC];
};

Arduino.forBlock['logic_null'] = function () {
	let code = 'NULL';
	return [code, Order.ATOMIC];
};
