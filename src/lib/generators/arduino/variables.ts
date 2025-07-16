import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino, Order, setups } from './util';

Arduino.forBlock['variables_get'] = (block) => {
	// Variable getter.
	let code = Arduino.nameDB_?.getName(
		block.getFieldValue('VAR'),
		Blockly.Variables.CATEGORY_NAME
	) || '';

	return [code, Order.ATOMIC];
};

Arduino.forBlock['variables_declare'] = (block) => {
	// Variable setter.
	let dropdown_type = block.getFieldValue('TYPE');

	let argument0 =
		Arduino.valueToCode(block, 'VALUE', Order.ASSIGNMENT) ||
		(dropdown_type === 'words' ? '""' : 0);

	let varName = Arduino.nameDB_?.getName(
		block.getFieldValue('VAR'),
		Blockly.Variables.CATEGORY_NAME
	) || '';

	block.workspace.getVariableMap().getVariableById(block.getFieldValue('VAR'))?.setType(dropdown_type);

	setups['setup_var' + varName] = varName + ' = ' + argument0 + ';\n';
	return '';
};

Arduino.forBlock['variables_set'] = (block) => {
	// Variable setter.
	let argument0 =
		Arduino.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';

	let varName = Arduino.nameDB_?.getName(
		block.getFieldValue('VAR'),
		Blockly.Variables.CATEGORY_NAME
	);

	return varName + ' = ' + argument0 + ';\n';
};
