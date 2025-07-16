import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino, Order } from './util';

Arduino.forBlock['math_number'] = (block) => {
	// Numeric value.
	let code = parseFloat(block.getFieldValue('NUM'));
	// -4.abs() returns -4 in Dart due to strange order of operation choices.
	// -4 is actually an operator and a number.  Reflect Arduino in the order.
	let order = code < 0 ? Order.UNARY_PREFIX : Order.ATOMIC;
	return [code.toString(), order];
};

Arduino.forBlock['math_arithmetic'] = (block) => {
	// Basic arithmetic operators, and power.
	let mode = block.getFieldValue('OP') as keyof typeof math_arithmetic;
	let tuple = math_arithmetic[mode];
	let operator = tuple[0] as string;
	let order = tuple[1] as Order;
	let argument0 = Arduino.valueToCode(block, 'A', order) || '0';
	let argument1 = Arduino.valueToCode(block, 'B', order) || '0';
	let code;
	if (!operator) {
		code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
		return [code, Order.UNARY_POSTFIX];
	}
	code = argument0 + operator + argument1;
	return [code, order];
};

const math_arithmetic = {
	ADD: [' + ', Order.ADDITIVE],
	MINUS: [' - ', Order.ADDITIVE],
	MULTIPLY: [' * ', Order.MULTIPLICATIVE],
	DIVIDE: [' / ', Order.MULTIPLICATIVE],
	POWER: [null, Order.NONE] // Handle power separately.
};
