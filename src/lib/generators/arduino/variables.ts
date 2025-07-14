import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino } from './util';

Arduino.forBlock['variables_get'] = function () {
	// Variable getter.
	let code = Arduino.nameDB_.getName(
		Arduino.getFieldValue('VAR'),
		Blockly.Variables.NAME_TYPE
	);

	return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['variables_declare'] = function (workspace) {
	// Variable setter.
	let dropdown_type = Arduino.getFieldValue('TYPE');

	let argument0 =
		Arduino.valueToCode(Arduino, 'VALUE', Arduino.ORDER_ASSIGNMENT) ||
		(dropdown_type === 'words' ? '""' : 0);

	let varName = Arduino.nameDB_.getName(
		Arduino.getFieldValue('VAR'),
		Blockly.Variables.NAME_TYPE
	);

	// for(let i of workspace.workspace.variableMap.variableMap){
	// for(let j of i[1]){
	// 	if(j.id_ === Arduino.getFieldValue('VAR')){
	// 		j.type = (dropdown_type === 'words'? 'String': 'int');
	// 		break;
	// 	}
	// }
	// }

	Arduino.setups_['setup_var' + varName] = varName + ' = ' + argument0 + ';\n';
	return '';
};

Arduino.forBlock['variables_set'] = function (workspace) {
	// Variable setter.
	let argument0 =
		Arduino.valueToCode(Arduino, 'VALUE', Arduino.ORDER_ASSIGNMENT) || '0';

	let varName = Arduino.nameDB_.getName(
		Arduino.getFieldValue('VAR'),
		Blockly.Variables.NAME_TYPE
	);

	return varName + ' = ' + argument0 + ';\n';
};
