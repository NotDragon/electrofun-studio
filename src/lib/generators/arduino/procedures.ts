import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino, Order, definitions } from './util';

Arduino.forBlock['procedures_defreturn'] = (block) => {
	// Define a procedure with a return value.
	let funcName = Arduino.nameDB_?.getName(
		block.getFieldValue('NAME'),
		Blockly.Procedures.CATEGORY_NAME
	) || '';

	let branch = Arduino.statementToCode(block, 'STACK');
	if (Arduino.INFINITE_LOOP_TRAP) {
		branch = Arduino.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + block.id + "'") + branch;
	}

	let returnValue = Arduino.valueToCode(block, 'RETURN', Order.NONE) || '';

	if (returnValue) {
		returnValue = '  return ' + returnValue + ';\n';
	}

	let returnType = returnValue ? 'int' : 'void';
	let args = [];

	for (let x of block.getFields()) {
		args.push(`int ${Arduino.nameDB_?.getName(x.name ?? '', Blockly.Variables.CATEGORY_NAME)}`);
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
	code = Arduino.scrub_(block, code);
	definitions[funcName] = code;

	return null;
};

Arduino.forBlock['procedures_callreturn'] = (block) => {
	// Call a procedure with a return value.
	let funcName = Arduino.nameDB_?.getName(
		block.getFieldValue('NAME'),
		Blockly.Procedures.CATEGORY_NAME
	);

	let args = [];
	let counter = 0;
	for (let _ of block.getFields()) {
		counter++;
		args[counter] =
			Arduino.valueToCode(block, 'ARG' + counter, Order.NONE) || 'null';
	}
	let code = funcName + '(' + args.join(', ') + ')';

	return [code, Order.UNARY_POSTFIX];
};

Arduino.forBlock['procedures_callnoreturn'] = (block) => {
	// Call a procedure with no return value.
	let funcName = Arduino.nameDB_?.getName(
		block.getFieldValue('NAME'),
		Blockly.Procedures.CATEGORY_NAME
	);

	let args = [];
	let counter = 0;
	for (let _ of block.getFields()) {
		counter++;
		args[counter] =
			Arduino.valueToCode(block, 'ARG' + counter, Order.NONE) || 'null';
	}
	let code = funcName + '(' + args.join(', ') + ');\n';
	return code;
};

Arduino.forBlock['procedures_ifreturn'] = (block) => {
	// Conditionally return value from a procedure.
	let condition =
		Arduino.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
	let code = 'if (' + condition + ') {\n';
	if (true) {
		let value =
			Arduino.valueToCode(block, 'VALUE', Order.NONE) || 'null';
		code += '  return ' + value + ';\n';
	} else {
		code += '  return;\n';
	}
	code += '}\n';
	return code;
};
