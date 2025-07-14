import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino } from './util';

Arduino.forBlock['procedures_defreturn'] = function () {
	// Define a procedure with a return value.
	let funcName = Arduino.nameDB_.getName(
		Arduino.getFieldValue('NAME'),
		Blockly.Procedures.NAME_TYPE
	);
	let branch = Arduino.statementToCode(Arduino, 'STACK');
	if (Arduino.INFINITE_LOOP_TRAP) {
		branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + Arduino.id + "'") + branch;
	}
	let returnValue =
		Arduino.valueToCode(Arduino, 'RETURN', Arduino.ORDER_NONE) || '';
	if (returnValue) {
		returnValue = '  return ' + returnValue + ';\n';
	}
	let returnType = returnValue ? 'int' : 'void';
	let args = [];
	for (let x = 0; x < Arduino.arguments_.length; x++) {
		args[x] =
			'int ' +
			Arduino.nameDB_.getName(Arduino.arguments_[x], Blockly.Variables.NAME_TYPE);
	}
	let code =
		returnType +
		' ' +
		funcName +
		'(' +
		args.join(', ') +
		') {\n' +
		branch +
		returnValue +
		'}\n';
	code = Arduino.scrub_(Arduino, code);
	Arduino.definitions_[funcName] = code;
	return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Arduino.procedures_defnoreturn = Arduino.procedures_defreturn;

Arduino.forBlock['procedures_callreturn'] = function () {
	// Call a procedure with a return value.
	let funcName = Arduino.nameDB_.getName(
		Arduino.getFieldValue('NAME'),
		Blockly.Procedures.NAME_TYPE
	);
	let args = [];
	for (let x = 0; x < Arduino.arguments_.length; x++) {
		args[x] =
			Arduino.valueToCode(Arduino, 'ARG' + x, Arduino.ORDER_NONE) || 'null';
	}
	let code = funcName + '(' + args.join(', ') + ')';
	return [code, Arduino.ORDER_UNARY_POSTFIX];
};

Arduino.forBlock['procedures_callnoreturn'] = function () {
	// Call a procedure with no return value.
	let funcName = Arduino.nameDB_.getName(
		Arduino.getFieldValue('NAME'),
		Blockly.Procedures.NAME_TYPE
	);
	let args = [];
	for (let x = 0; x < Arduino.arguments_.length; x++) {
		args[x] =
			Arduino.valueToCode(Arduino, 'ARG' + x, Arduino.ORDER_NONE) || 'null';
	}
	let code = funcName + '(' + args.join(', ') + ');\n';
	return code;
};

Arduino.forBlock['procedures_ifreturn'] = function () {
	// Conditionally return value from a procedure.
	let condition =
		Arduino.valueToCode(Arduino, 'CONDITION', Arduino.ORDER_NONE) || 'false';
	let code = 'if (' + condition + ') {\n';
	if (Arduino.hasReturnValue_) {
		let value =
			Arduino.valueToCode(Arduino, 'VALUE', Arduino.ORDER_NONE) || 'null';
		code += '  return ' + value + ';\n';
	} else {
		code += '  return;\n';
	}
	code += '}\n';
	return code;
};
